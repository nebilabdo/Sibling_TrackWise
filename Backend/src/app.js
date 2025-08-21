const express = require("express");
require("dotenv").config();
const connectDB = require("../src/config/db.js");
const cors = require("cors");

const userRoutes = require("./routes/UserRoutes");
const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const progressRoutes = require("./routes/progressRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const chapterPageRoutes = require("./routes/chapterPageRoutes");

const app = express();

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/chapterpages", chapterPageRoutes);
app.use("/api/progress", progressRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Sibling TrackWise Backend!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
