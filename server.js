const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

// MongoDB 連接
const dbUri = process.env.MONGO_URI;
mongoose.connect(dbUri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    score: Number,
    balls: Number,
});

const User = mongoose.model("User", userSchema);

app.use(cors());
app.use(bodyParser.json());

// 提供靜態文件伺服
app.use(express.static("public"));

// 獲取所有用戶
app.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// 更新或新增用戶
app.post("/user", async (req, res) => {
    const { username, password, score, balls } = req.body;
    const user = await User.findOneAndUpdate(
        { username },
        { username, password, score, balls },
        { upsert: true, new: true }
    );
    res.json(user);
});

// 根路徑導向 index.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
