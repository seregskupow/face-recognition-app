const { Schema, Types, model } = require("mongoose");

const Actor = new Schema({
  akas: [],
  image: { type: Object, required: true },
  name: { type: String, required: true },
  knownFor:[{type:Object,required: true}],
  birthday: { type: String, required: true },
  birthPlace: { type: String, required: true },
  biography: { type: String, required: true }
});
module.exports = model("Actor", Actor);
