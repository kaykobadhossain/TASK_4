import jwt from 'jsonwebtoken'

// Verify JWT token
export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No token provided.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token.' 
        });
    }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Access denied. Admin privileges required.' 
        });
    }
    next();
};

// Check if user owns the resource
export const isOwner = (resourceUserId) => {
    return (req, res, next) => {
        if (req.user.id !== resourceUserId && req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. You can only access your own resources.' 
            });
        }
        next();
    };
};
