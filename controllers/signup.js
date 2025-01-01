import User from "../models/user.js";
import sendOTP from "../utils/otp.js"
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import z from "zod";
import bcrypt from "bcrypt";
// import cookie from "cookie";

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

        res.setHeader("x-otp-token", otpToken);
        return res.status(200).json({ message: "OTP send successfully" })
    }
    catch(error) {
        console.log(error);
        return res.send(500).json({ error });
    }
}

async function verifyOtpController(req, res) {
    const { email, password, otp } = req.body;
    const otpToken  = req.headers["x-otp-token"];

    if(!(email && password && otp && otpToken)) {
        return res.status(400).json({ message: "Something went wrong" });
    }

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET_OTP);

    if(decoded.otp != otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    try {
        bcrypt.hash(password, 5, async(err, hashedPassword) => {            
            if(err) throw err;

            const user = await User.create({ 
                email, 
                password: hashedPassword 
            });

            const token = jwt.sign({ 
                id: user._id.toString(),
                email 
            }, process.env.JWT_SECRET);
            
            return res.status(200).json({ message: "User created", token });
        })
    }
    catch(error) {
        console.log(error);
        return res.send(500).json({ error });
    }
}

export { sendOtpController, verifyOtpController };