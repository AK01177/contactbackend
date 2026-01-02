const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(cors())

// Database connection
const connection = mongoose.connect(process.env.mongourl)

// Contact Model
const ContactSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const ContactModel = mongoose.model("contact", ContactSchema)

// API Routes
app.get("/api/contacts", async (req, res) => {
    try {
        const contacts = await ContactModel.find()
        res.status(200).send(contacts)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

app.post("/api/contacts", async (req, res) => {
    try {
        const newContact = new ContactModel(req.body)
        await newContact.save()
        res.status(200).send({ message: "Contact added successfully" })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

app.put("/api/contacts/:id", async (req, res) => {
    try {
        const id = req.params.id
        await ContactModel.findByIdAndUpdate(id, req.body)
        res.status(200).send({ message: "Contact updated successfully" })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

app.delete("/api/contacts/:id", async (req, res) => {
    try {
        const id = req.params.id
        await ContactModel.findByIdAndDelete(id)
        res.status(200).send({ message: "Contact deleted successfully" })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// Root route for health check
app.get("/", (req, res) => {
    res.send("Contact Management API is running")
})

// Start server
const PORT = process.env.PORT || process.env.port || 5000
app.listen(PORT, async () => {
    try {
        await connection
        console.log("Connected to database")
    } catch (error) {
        console.log("Database connection failed:", error.message)
    }
    console.log(`Server running on port ${PORT}`)
})
