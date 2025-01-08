import jwt from "jsonwebtoken";
import User from "../models/user.js";

async function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    
            const user = await User.findById(decoded.id);
            console.log(user);
    
            if(!user) {
                return res.status(403).json({ message: "Invalid credentials" });
            }
    
            req.user = user;
            return next();
        }
        catch(error) {
            return res.status(500).json({ error });
        }
    }

    const trialPlaysUsed = req.cookies.trialPlaysUsed || 0;

    if(trialPlaysUsed < 3) {
        res.cookie(
            "trialPlaysUsed", 
            parseInt(trialPlaysUsed) + 1, 
            { httpOnly: true }
        )
        return next();
    }

    return res.status(403).json({
        message: "Trial limit reached. Please log in." 
    });
}

export default authMiddleware;