import DateModel from '../models/Date.js';

let isSyncing = false;

/**
 * Normalizes a time string (e.g. "13h30", "12h", "1:30 PM", "10:15 AM") into minutes from midnight.
 * @param {string} timeStr 
 * @returns {number} minutes from midnight
 */
export function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;

  const trimmed = timeStr.trim();

  // Handle AM/PM format (e.g. "1:30 PM", "10:15 AM")
  if (trimmed.includes('AM') || trimmed.includes('PM')) {
    const parts = trimmed.split(/\s+/);
    const period = parts[1];
    const timeParts = parts[0].split(':');
    let hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    return hour * 60 + minute;
  }

  // Handle 24h format (e.g. "13h30", "14h")
  const parts = trimmed.split('h');
  const hour = parseInt(parts[0], 10) || 0;
  const minute = parts[1] ? parseInt(parts[1], 10) : 0;

  return hour * 60 + minute;
}

/**
 * Generates all 32 standard slots from 10:00 AM to 5:45 PM (each 15 minutes).
 * Returns array of objects with time and minutes.
 */
function generateStandardSlots() {
  const slots = [];
  const startHour = 10;
  const endHour = 18;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      const timeString = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      const totalMinutes = hour * 60 + minute;

      slots.push({
        time: timeString,
        minutes: totalMinutes
      });
    }
  }

  return slots;
}

/**
 * Extracts date from a name string (e.g. "Artist Day 26/7/2026") and returns a Date object.
 * @param {string} name 
 * @returns {Date} parsed date object
 */
export function parseDateFromName(name) {
  const dateMatch = name.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
  if (dateMatch) {
    const day = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10);
    const year = dateMatch[3] ? parseInt(dateMatch[3], 10) : 2026;
    return new Date(year, month - 1, day);
  }
  // If no date found, return a date far in the future
  return new Date(2999, 11, 31);
}

/**
 * Synchronizes dates and slots from the Google Sheet App Script API into MongoDB.
 * Dates will have exactly 32 slots. The slots specified in the Google Sheet are marked
 * as BOOKED (available: false), and all other slots are Available (available: true).
 */
export async function syncGoogleSheets() {
  if (isSyncing) {
    console.log('⏳ Sync already in progress, skipping background run.');
    return { success: false, message: 'Sync already in progress' };
  }

  isSyncing = true;
  console.log('🔄 Starting Google Sheets sync (booked slots override mode & chronological sort)...');

  try {
    const url = 'https://script.google.com/macros/s/AKfycbxksGYu5_dETOW6-ZzZALr0QuedudjJJmITv2kXSNhqBJPJ0g_QORZMBJLJORrT6L6o/exec';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      console.warn('⚠️ Google Sheets sync: Received empty or invalid data from API.');
      isSyncing = false;
      return { success: false, message: 'Invalid or empty data received from Google Sheets API' };
    }

    let createdCount = 0;
    let updatedCount = 0;

    // Fetch all existing dates from MongoDB
    const existingDates = await DateModel.find();

    // Standard 32 slots reference list
    const standardSlotsRef = generateStandardSlots();

    // Sort the sheet keys chronologically (earlier date first)
    const sortedSheetKeys = Object.keys(data).sort((a, b) => {
      return parseDateFromName(a) - parseDateFromName(b);
    });

    let currentOrder = 0;
    const syncedIds = new Set();

    for (const sheetName of sortedSheetKeys) {
      const sheetSlotRanges = data[sheetName];
      if (!Array.isArray(sheetSlotRanges)) continue;

      // 1. Gather all booked slot minutes defined in the Google Sheet ranges
      const bookedMinutes = new Set();

      for (const range of sheetSlotRanges) {
        const { startTime, slots } = range;
        if (!startTime || typeof slots !== 'number') continue;

        // Parse starting hour and minute
        const timeRegex = /^(\d+)h(?:(\d+))?$/;
        const match = startTime.match(timeRegex);
        if (!match) continue;

        const startHour = parseInt(match[1], 10);
        const startMinute = match[2] ? parseInt(match[2], 10) : 0;

        for (let i = 0; i < slots; i++) {
          const totalMinutes = startHour * 60 + startMinute + i * 15;
          bookedMinutes.add(totalMinutes);
        }
      }

      // 2. Find matching date in MongoDB
      const sheetNameNormalized = sheetName.replace(/\/\d{4}$/, '').trim();
      let dbDate = existingDates.find(d => {
        const dbNameNormalized = d.name.replace(/\/\d{4}$/, '').trim();
        return d.name.toLowerCase() === sheetName.toLowerCase() ||
          dbNameNormalized.toLowerCase() === sheetNameNormalized.toLowerCase();
      });

      if (dbDate) {
        // Update name to standard year suffix name if it differs
        if (dbDate.name !== sheetName) {
          dbDate.name = sheetName;
        }

        // Assign chronological order
        dbDate.order = currentOrder++;
        syncedIds.add(dbDate._id.toString());

        // Map existing slots by minutes
        const existingSlotsMap = new Map(); // minutes -> slot document
        for (const slot of dbDate.slots) {
          const mins = timeStringToMinutes(slot.time);
          existingSlotsMap.set(mins, slot);
        }

        const newSlots = [];

        // Build the 32 slots list, setting availability
        for (const ref of standardSlotsRef) {
          const isBooked = bookedMinutes.has(ref.minutes);
          const existingSlot = existingSlotsMap.get(ref.minutes);

          if (existingSlot) {
            newSlots.push({
              _id: existingSlot._id,
              time: ref.time,
              available: !isBooked // false if booked, true if available
            });
          } else {
            newSlots.push({
              time: ref.time,
              available: !isBooked // false if booked, true if available
            });
          }
        }

        dbDate.slots = newSlots;
        await dbDate.save();
        updatedCount++;
      } else {
        // 3. Create new date since it doesn't exist
        const order = currentOrder++;

        const slots = standardSlotsRef.map(ref => {
          const isBooked = bookedMinutes.has(ref.minutes);
          return {
            time: ref.time,
            available: !isBooked // false if booked, true if available
          };
        });

        const newDate = new DateModel({
          name: sheetName,
          location: '',
          fullSlot: false,
          fullSlotMessage: '',
          order,
          slots
        });

        await newDate.save();
        syncedIds.add(newDate._id.toString());
        createdCount++;
      }
    }

    // 4. Reorder any remaining non-synced dates in MongoDB so they appear after the synced ones
    for (const d of existingDates) {
      if (!syncedIds.has(d._id.toString())) {
        d.order = currentOrder++;
        await d.save();
      }
    }

    console.log(`✅ Google Sheets sync completed successfully. Created: ${createdCount}, Updated: ${updatedCount}`);
    isSyncing = false;
    return { success: true, createdCount, updatedCount };

  } catch (error) {
    console.error('❌ Error during Google Sheets sync:', error);
    isSyncing = false;
    return { success: false, error: error.message };
  }
}
