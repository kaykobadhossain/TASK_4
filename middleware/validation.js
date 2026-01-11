// Validate user registration
export const validateRegistration = (req, res, next) => {
    const { username, email, password } = req.body;
    const errors = [];

    if (!username || username.trim().length < 3) {
        errors.push('Username must be at least 3 characters long');
    }

    if (!email || !isValidEmail(email)) {
        errors.push('Valid email is required');
    }

    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Validation failed', 
            errors 
        });
    }

    next();
};

// Validate login
export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email) {
        errors.push('Email is required');
    }

    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Validation failed', 
            errors 
        });
    }

    next();
};

// Validate task creation/update
export const validateTask = (req, res, next) => {
    const { title } = req.body;
    const errors = [];

    if (!title || title.trim().length === 0) {
        errors.push('Title is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Validation failed', 
            errors 
        });
    }

    next();
};

// Helper function to validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};