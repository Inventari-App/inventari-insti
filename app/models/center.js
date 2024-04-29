const mongoose = require("mongoose");
const { capitalizeFields } = require("../db/middlewares");
const Schema = mongoose.Schema;

const CenterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

CenterSchema.pre('save', capitalizeFields(["name"]))

module.exports = mongoose.model("Center", CenterSchema);
