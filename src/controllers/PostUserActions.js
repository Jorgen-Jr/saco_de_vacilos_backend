const PostUserAction = require('../models/PostUserAction');
const Sequelize = require('sequelize');

module.exports = {
    async store(req, res) {
        const post_id = parseInt(req.params.id);

        const {
            user_id,
            action,
        } = req.body;

        const post_action = await PostUserAction.create({
            post_id,
            user_id,
            action,
        }).catch(err => {
            return res.status(500).json({ message: err.message })
        });

        return res.json(post_action);
    },

    async update(req, res) {
        const action_id = req.params.id;

        const {
            action,
        } = req.body;

        const post_action = await PostUserAction.update(
            {
                action,
            },
            { where: { id: action_id } }
        );

        return res.json(post_action);
    },
}