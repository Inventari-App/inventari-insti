const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const { generateHash } = require('random-hash');
const { getExpirationTs } = require('../utils/helpers')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  verificationHash: { type: String, default: generateHash({ length: 8 })},
  verificationTs: { type: Number, default: getExpirationTs(60 * 10 * 1000) }, // 10mins
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
