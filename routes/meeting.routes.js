const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Client = require("../models/Client.model");

function getAllMeetings(arg) {
  let allMeetings = [];
  arg.forEach((client) => {
    allMeetings.concat(client.meetings);
  });
  return allMeetings;
}

// GET ALL USER MEETINGS
router.get("/meetings", (req, res, next) => {
  Client.find({ owner: req.user.id })
    .then((allClients) => {
      res.json(getAllMeetings(allClients));
    })
    .catch((err) => res.json(err));
});

// GET ALL CLIENT'S MEETINGS
router.get("/clients/:clientId/meetings", (req, res, next) => {
  const { clientId } = req.params;

  Client.findById(clientId)
    .then((client) => {
      res.json(client.meetings);
    })
    .catch((err) => res.json(err));
});

// GET ONE MEETING
router.get("/clients/:clientId/meetings/:meetingId", (req, res, next) => {
  const { clientId, meetingId } = req.params;

  Client.findById(clientId)
    .then((client) => {
      res.json(client.meetings.find((elm) => elm._id == meetingId));
    })
    .catch((err) => res.json(err));
});

// CREATE MEETING
router.post("/clients/:clientId/meetings", (req, res, next) => {
  const { clientId } = req.params;
  const { date, title, location, description } = req.body;

  Client.findByIdAndUpdate(clientId, { $push: { meetings: { date, title, location, description } } })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// EDIT MEETING
router.put("/clients/:clientId/meetings/:meetingId", (req, res, next) => {
  const { clientId, meetingId } = req.params;
  const { date, title, location, description } = req.body;

  // @TODO check if meeting id exists
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Client.findOneAndUpdate(
    { _id: clientId, meetings: { $elemMatch: { _id: meetingId } } },
    { $set: { "meetings.$": { date, title, location, description } } }
  )
    .then(() => res.json({ message: `Client with ${clientId} is updated successfully.` }))
    .catch((error) => res.json(error));
});

// DELETE MEETING
router.delete("/clients/:clientId/meetings/:meetingId", (req, res, next) => {
  const { clientId, meetingId } = req.params;

  // @TODO check if meeting id exists
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Client.findByIdAndUpdate({ _id: clientId }, { $pull: { meetings: { _id: meetingId } } })
    .then(() => res.json({ message: `Meeting with ${meetingId} is removed successfully.` }))
    .catch((error) => res.json(error));
});

module.exports = router;
