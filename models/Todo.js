import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Done"],
        default: "To Do"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    order: {
        type: Number,
        default: 0
    }
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;