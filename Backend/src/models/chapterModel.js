const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
    semester: { type: Number, required: true, default: 1 },
    totalPages: { type: Number, default: 20 },
    chapterNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chapter", chapterSchema);
