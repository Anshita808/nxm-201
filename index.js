const express = require("express");
require("dotenv").config();
const {connection} = require("./config/db");
const { userRouter } = require("./routes/user.routes");
const {moderatorRouter} = require("./routes/moderator");
const {postRouter} = require("./routes/post.routes");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/authentication");


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/user",userRouter);
app.use(auth)
app.use("/admin",moderatorRouter);
app.use("/blog",postRouter);




app.listen(process.env.PORT, async(req,res)=>{
    try {
        await connection
        console.log("connected to db");
    } catch (error) {
        console.log(error);
    }
    console.log("server is running on 8080 PORT");
})