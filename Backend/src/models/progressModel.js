const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
      default: 0,
    },
    startPage: {
      type: Number,
      default: 1,
      min: 1,
    },
    stopPage: {
      type: Number,
      default: 0,
      validate: {
        validator: function (v) {
          return v <= this.totalPages;
        },
        message: "Stop page cannot exceed total pages!",
      },
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    quizScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    finalTestScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Auto-set 'isCompleted' if stopPage reaches totalPages
ProgressSchema.pre("save", function (next) {
  if (this.stopPage >= this.totalPages) {
    this.isCompleted = true;
  }
  next();
});

module.exports = mongoose.model("Progress", ProgressSchema);
