import jwt from "jsonwebtoken";
import User from "../models/user.js";

async function authentication(req, res, next) {
    const token = req.headers["token"];

    if(!token) {
        return res.status(400).json({ message: "Invalid credentails" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        const user = await User.findById(decoded.id);
        console.log(user);

        if(!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        req.token = token;
        next();
    }
    catch(error) {
        return res.status(500).json({ error });
    }
}

export default authentication;