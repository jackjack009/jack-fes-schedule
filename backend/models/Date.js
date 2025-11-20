import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
});

const dateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  slots: [slotSchema]
}, {
  timestamps: true
});

// Generate 32 slots from 10 AM to 6 PM (15-minute intervals)
dateSchema.methods.generateSlots = function() {
  const slots = [];
  const startHour = 10;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      const timeString = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      
      slots.push({
        time: timeString,
        available: true
      });
    }
  }
  
  this.slots = slots;
  return this;
};

const Date = mongoose.model('Date', dateSchema);

export default Date;
