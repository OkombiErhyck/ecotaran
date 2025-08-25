const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,          // personal name (e.g. Ion)
  family: String,        // family grouping (e.g. Popescu)
  email: { type: String, unique: true },
  password: String,
  permissions: {
    type: Map,
    of: Boolean,
    default: {},
  },
});


const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
