const { Schema, Types, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  results: 
    {
      type: Types.ObjectId,
      ref: "userHistory"
    }
  
});
module.exports = model("User", userSchema);
