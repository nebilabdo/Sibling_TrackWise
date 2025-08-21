// src/validators/progressValidator.js
const { param } = require("express-validator");
const mongoose = require("mongoose");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const progressValidationRules = () => {
  return [
    param("userId").custom(isValidObjectId).withMessage("Invalid userId"),
    param("subjectId").custom(isValidObjectId).withMessage("Invalid subjectId"),
    param("chapterId")
      .optional() // chapterId might not be present in some routes like /:userId/:subjectId
      .custom((value) => isValidObjectId(value))
      .withMessage("Invalid chapterId"),
  ];
};

module.exports = { progressValidationRules };
