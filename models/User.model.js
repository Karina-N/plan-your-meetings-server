const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, "Name is required."],
    // unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    match: [/^[a-zA-Z0-9!@#$%^&*]{6,16}$/, "Please use valid password."],
  },
  address: String,
});

const User = model("User", userSchema);

module.exports = User;
