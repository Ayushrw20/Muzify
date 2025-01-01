import express from "express";
import "dotenv/config";
import connectDB from "./db.js";
import cors from "cors";

import signupRouter from "./routes/signup.js";
import signinRouter from "./routes/signin.js";
import songsRouter from "./routes/song.js"

import authentication from "./middlewares/authentication.js"

const app = express();

connectDB()
.then(() => {
    app.listen(process.env.PORT);
})
.catch((error) => console.log(error))

app.use(cors());
app.use(express.json());

app.use("/user/signup", signupRouter);
app.use("/user/signin", signinRouter);

// app.use(authentication);

app.use("/song", songsRouter);