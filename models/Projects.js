const mongoos = require('mongoose');
const Schema = mongoos.Schema;

const Projects = new Schema({
    name: {
        required: true,
        type: String
    },
    owner: {
        type: Object,
        require: true
    },
    teamMembers: [
        {
            email: {
                type: String
            },
            name: {
                type: String
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoos.model("projects", Projects);