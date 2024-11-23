const express = require("express");
const Todo = require("../models/todo");

todoRouter = express.Router();

todoRouter.get("/:id?", async (req, res) => {
    const { id } = req.params;
    if (id) {
        try {
            const todo = await Todo.findOne({ _id: id });
            if (!todo) {
                return res.status(404).json({ message: "Todo not found" });
            }
            return res.status(200).json(todo);
        } catch (error) {
            return res.status(500).json({ error: error.message || "An error occurred while fetching the todo." });
        }
    }

    // Handle fetching all Todos if no ID is provided
    try {
        const todos = await Todo.find();
        return res.status(200).json({ todos });
    } catch (error) {
        return res.status(500).json({ error: error.message || "An error occurred while fetching todos." });
    }
});



const addTodo = async (req, res) => {
    try {
        const { todos } = req.body;

        // Check if `todos` is an array
        if (Array.isArray(todos)) {
            // Validate each todo in the array
            const todoPromises = todos.map((todo) => {
                if (!todo.title) {
                    throw new Error("Each todo must have a title.");
                }
                return new Todo({
                    title: todo.title,
                    description: todo.description || "", // Default to empty string if description is not provided
                    status: todo.status || false, // Default to false if status is not provided
                });
            });

            // Save todos in bulk
            const newTodos = await Todo.insertMany(todoPromises);

            return res
                .status(201)
                .json({ message: "Todos added successfully", todos: newTodos });
        }

        // Handle single todo
        const { title, description = "", status = false } = req.body;
        if (!title) {
            return res.status(400).json({ error: "Title is required." });
        }

        const todo = new Todo({ title, description, status });
        const newTodo = await todo.save();

        res.status(201).json({
            message: "Todo added successfully",
            todo: newTodo,
            todos: newTodo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "An error occurred." });
    }
};
todoRouter.post('/',addTodo); 

async function updateTodo(req, res) {
    console.log('koi aya update karne')
    try {
        const id = req.params.id;
        const body = req.body;

        const updatedTodo = await Todo.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedTodo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
todoRouter.put("/:id", updateTodo);

const deleteTodo = async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({
                error: "Todo not found",
            });
        }
        const allTodos = await Todo.find();
        res.status(200).json({
            message: "Todo deleted",
            todo: deletedTodo,
            todos: allTodos,
        });
    } catch (error) {
        throw error;
    }
};
todoRouter.delete("/:id", deleteTodo);


module.exports = todoRouter;
