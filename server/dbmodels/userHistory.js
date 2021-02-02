const { Schema, Types, model } = require("mongoose");

const historySchema = new Schema({
  actors: [{type:Object,required: true}],
  date: { type: Date, default: Date.now },
  usedImage:{type: String},default:"",
  owner: { type: Types.ObjectId, ref: "User" }
});
module.exports = model("userHistory", historySchema);
//{ name: { type: String, required: true }, link: { type: String } }