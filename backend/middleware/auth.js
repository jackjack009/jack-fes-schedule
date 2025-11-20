export const requireAuth = (req, res, next) => {
    if (req.session && req.session.adminId) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized. Please login.' });
    }
};
