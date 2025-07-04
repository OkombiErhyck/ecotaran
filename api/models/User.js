const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  permissions: {
    type: Map,
    of: Boolean,
    default: {}, // empty permissions by default
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
