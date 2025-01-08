import bcrypt from "bcrypt";
import User from "../models/user.js";
import z from "zod";
import jwt from "jsonwebtoken";

const emailSchema = z.object({ email: z.string().email() });

async function signinController(req, res) {
    const { email, password } = req.body;

    if(!(email && password)) res.status(400).json({ message: "Email or password is not present" });

    const isEmailVerified = emailSchema.safeParse({ email });
    if(!isEmailVerified.success) {
        return res.status(400).json({ message: "Inavlid email format" });
    }

    const user = await User.findOne({ email });
    // console.log(user);

    if(!user) {
        return res.status(500).json({ 
            message: "Invalid email, user not found!!" 
        });
    }

    const result = await bcrypt.compare(password, user.password);

    if(!result) {
        return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({
        id: user._id.toString(),
        email: email
    }, process.env.JWT_SECRET);

    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({ message: "You are signed in."});
}

export default signinController;