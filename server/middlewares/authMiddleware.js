const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.cookies.uid; // Retrieve JWT from cookies

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request object
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = authenticate;
