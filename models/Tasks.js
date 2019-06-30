const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Task = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: "projects",
        required: true
    },
    taskName: {
        type: String,
        required: true
    },
    dateDue: {
        type: String
    },
    assignee: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("tasks", Task);