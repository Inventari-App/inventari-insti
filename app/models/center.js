const mongoose = require("mongoose");
const { capitalizeFields } = require("../db/middlewares");
const Schema = mongoose.Schema;

const CenterSchema = new Schema({
  code: { type: String, required: true },
  private: { type: Boolean, required: false },
  type: { type: String, required: false },
  address: { type: String, required: false },
  postal_code: { type: String, required: false },
  phone: { type: String, required: false },
  comarca: { type: String, required: false },
  municipi: { type: String, required: false },
  localitat: { type: String, required: false },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

// CenterSchema.pre('save', capitalizeFields(["name"]))

module.exports = mongoose.model("Center", CenterSchema);
