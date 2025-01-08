import User from "../models/user.js";
import sendOTP from "../utils/otp.js"
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import z from "zod";
import bcrypt from "bcrypt";

const emailSchema = z.object({ email: z.string().email() });

async function sendOtpController(req, res) {
    const { email } = req.body;

    if(!email) return res.status(400).send("Send an email");

    const isEmailVerified = emailSchema.safeParse({ email });
    if(!isEmailVerified.success) {
        return res.status(400).send("Invalid email format");
    }

    try {
        const user = await User.findOne({ email: email });
        if(user) {
            return res.status(400).send("User already exists");
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        const otpToken = jwt.sign({ email, otp }, process.env.JWT_SECRET_OTP, {
            expiresIn: "3m"
        });

        sendOTP(email, otp);

        res.cookie("otpToken", otpToken, { httpOnly: true });
        return res.status(200).json({ message: "OTP send successfully" })
    }
    catch(error) {
        console.log(error);
        return res.send(500).json({ error });
    }
}

async function verifyOtpController(req, res) {
    const { firstName, lastName, email, password, otp } = req.body;
    const otpToken  = req.cookies.otpToken;

    if(!(firstName && lastName)) {
        return res.status(400).json({ message: "Some fields are missing" });        
    }
    if(!(email && password && otp && otpToken)) {
        return res.status(400).json({ message: "Some fields are missing" });
    }

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET_OTP);

    if(decoded.otp != otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if(decoded.email != email) {
        return res.status(403).json({ message: "Something went wrong" });
    }

    try {
        bcrypt.hash(password, 5, async(err, hashedPassword) => {            
            if(err) throw err;

            const user = await User.create({ 
                firstName,
                lastName,
                email, 
                password: hashedPassword 
            });

            const token = jwt.sign({ 
                id: user._id.toString(),
                email 
            }, process.env.JWT_SECRET);

            res.cookie("token", token, { httpOnly: true });
            
            return res.status(200).json({ message: "User created"});
        })
    }
    catch(error) {
        console.log(error);
        return res.send(500).json({ error });
    }
}

export { sendOtpController, verifyOtpController };