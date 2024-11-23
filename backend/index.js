const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoRouter = require('./routes/todo'); // Corrected the path to 'routes/todo'
const cors = require('cors');
dotenv.config(); // Load environment variables from a `.env` file

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

// Mount the todo router
app.use('/todos', todoRouter); // Prefix all todo routes with /todos

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
