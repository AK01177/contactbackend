const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Contact Schema
const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true }
}, { timestamps: true });

const Contact = mongoose.model("contact", contactSchema);

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongourl);
    console.log("Connected to database");
  } catch (err) {
    console.log("Database connection failed:", err.message);
    process.exit(1);
  }
};

// Controllers
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: "Contact added successfully", contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    
    res.status(200).json({ message: "Contact updated successfully", contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Contact Management API is running" });
});

app.get("/api/contacts", getContacts);
app.post("/api/contacts", createContact);
app.put("/api/contacts/:id", updateContact);
app.delete("/api/contacts/:id", deleteContact);

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
