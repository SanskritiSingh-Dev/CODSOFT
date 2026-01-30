const jwt = require('jsonwebtoken');

function protect(req, res, next) {
    try{
        const authHeader = req.headers.authorization;

        // Check for token exists
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({ message: "Unauthorized, token missing" });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized, token invalid" });
    }
}

//role-based access control middleware
function allowRoles(...roles){
    return(req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({ message: "Access denied, insufficient permissions" });
        }
        next();
    };
}

module.exports = { protect, allowRoles };