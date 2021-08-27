const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Client = require("../models/Client.model");

// GET ALL USER'S CLIENTS
router.get("/clients", (req, res, next) => {
  Client.find()
    .then((allClients) => res.json(allClients))
    .catch((err) => res.json(err));
});

// GET ONE CLIENT
router.get("/clients/:clientId", (req, res, next) => {
  const { clientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Client.findById(clientId)
    .then((client) => res.status(200).json(client))
    .catch((error) => res.json(error));
});

// CREATE CLIENT
router.post("/clients", (req, res, next) => {
  const { name, email, phone, description, address } = req.body;

  Client.create({
    name,
    email,
    phone,
    description,
    address,
    meetings: [],
    owner: req.body.owner, // change to owner: req.user._id
  })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// EDIT CLIENT
router.put("/clients/:clientId", (req, res, next) => {
  const { clientId } = req.params;
  const { name, email, phone, description, address } = req.body;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Client.findByIdAndUpdate(clientId, { name, email, phone, description, address })
    .then(() => res.json({ message: `Client with ${clientId} is updated successfully.` }))
    .catch((error) => res.json(error));
});

router.delete("/clients/:clientId", (req, res, next) => {
  const { clientId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Client.findByIdAndRemove(clientId)
    .then(() => res.json({ message: `Client with ${clientId} is removed successfully.` }))
    .catch((error) => res.json(error));
});

module.exports = router;
