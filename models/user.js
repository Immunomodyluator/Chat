import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  login: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  salt: { type: String },
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.password = crypto
    .pbkdf2Sync(password, this.salt, 1000, 32, `sha512`)
    .toString("hex");
};

userSchema.methods.validPassword = function (password) {
  const userPassword = crypto
    .pbkdf2Sync(password, this.salt, 1000, 32, `sha512`)
    .toString("hex");
  return this.password === userPassword;
};

export default mongoose.model("User", userSchema);
