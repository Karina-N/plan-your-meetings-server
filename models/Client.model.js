const { Schema, model } = require("mongoose");

const meetingSchema = new Schema({
  date: {
    type: String,
    required: [true, "Date is required."],
  },
  title: {
    type: String,
    required: [true, "Date is required."],
  },
  location: {
    type: String,
    required: [true, "Location is required."],
  },
  description: String,
});

const clientSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: String,
  description: String,
  address: String,
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  meetings: [meetingSchema],
});

const Client = model("Client", clientSchema);

module.exports = Client;
