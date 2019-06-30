const express = require('express');
const router = express.Router();
const passport = require('passport');

//Get the Project Schema
const Project = require('../../models/Projects');

/**
 * GET /api/projects/
 * Get all the projects for a specific user
 * Private Route
 */
router.get('/', passport.authenticate("jwt", { session: false }), async (req, res) => {

    try {
        let projectsArr = [];
        let projects = await Project.find({});
        if (projects) {
            projects.map(project => {
                project.teamMembers.map(member => {
                    if (member.email == req.user.email) {
                        projectsArr.push(project);
                    }
                })
            })
        }

        const OWNER = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        };

        let toalProjects = await Project.find({ owner: OWNER });

        if (toalProjects) {
            projectsArr = [...toalProjects, ...projectsArr];
            res.json(projectsArr);
        }

    } catch (error) {
        console.log(error);
    }
});

/**
 * GET api/projects/:id
 * Get specific project by id
 * Private route
 */
router.get('/:id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        let id = req.params.id;

        let result = Project.findById(id);

        if (result) {
            res.json(result);
        }
    } catch (error) {
        console.log(error);
    }
});

/**
 *  POST api/projects/create
 *  Create a new Project
 *  Private
 */
router.post('/create', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const OWNER = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        };

        const newProject = await new Project({
            name: req.user.name,
            owner: OWNER,
            teamMembers: req.body.members
        });

        newProject.save().then((project) => {
            res.json(project);
        });

    } catch (error) {
        console.log(error);
    }
});

/**
 * @route  PATCH api/projects/update
 * @desc   Update an existing project
 * @access Private 
 */

router.patch('/update', passport.authenticate("jwt", { session: false }), (req, res) => {
    let projectFields = {};

    projectFields.name = req.body.projectName;
    projectFields.teamMembers = req.body.members;

    Project.findOneAndUpdate(
        { _id: req.body.id },
        { $set: projectFields },
        { new: true }
    )
        .then(project => {
            res.json(project);
        })
        .catch(error => console.log(error))
});

/**
 * @route DELETE api/projects/delete/:id
 * @desc Delete an existing project
 * @access Private
 */
router.delete("/delete/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Project.findById(req.params.id).then(project => {
        project.remove().then(() => res.json({ success: true }));
    });
});

module.exports = router;