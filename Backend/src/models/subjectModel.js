const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
    estimatedTime: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);
