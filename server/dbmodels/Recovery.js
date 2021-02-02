const { Schema, Types, model } = require("mongoose");

const Recovery = new Schema({
  expire_at: { type: Date, default: Date.now, expires: 72000 },
  code: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  recoveryToken :{
    type:String,
    required:true
  }
});
module.exports = model("Recovery", Recovery);
