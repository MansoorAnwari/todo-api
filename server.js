import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Todo from "./models/Todo.js";


const app = express();
app.use(cors());
app.use(express.json());

// اتصال به MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected..."))
    .catch((error) => console.error("MongoDB connection error:", error));

// مسیر اصلی سرور
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// دریافت همه تسک‌ها از دیتابیس
app.get("/api/todos", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: "Error fetching todos" });
    }
});


// ساخت تسک جدید
app.post("/api/todos", async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: "Title required" });

        const newTodo = new Todo({ title });
        await newTodo.save();

        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: "Error creating todo" });
    }
});


// دریافت تسک با ID
app.get("/api/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ error: "Todo not found" });

        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: "Error fetching todo" });
    }
});


// ویرایش تسک با ID
app.put("/api/todos/:id", async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: "Title required" });

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title },
            { new: true }
        );

        if (!updatedTodo) return res.status(404).json({ error: "Todo not found" });

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: "Error updating todo" });
    }
});

// حذف تسک با ID
app.delete("/api/todos/:id", async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) return res.status(404).json({ error: "Todo not found" });

        res.json({ message: "Todo deleted", deletedTodo });
    } catch (error) {
        res.status(500).json({ error: "Error deleting todo" });
    }
});


// سرور اجرا شود
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));