const UserSettings = require('../models/UserSettings');
const Sequelize = require('sequelize');

module.exports = {
    async indexByPk(req, res) {
        const user_id = req.params.id;

        const user_settings = await UserSettings.findAll(
            {
                where: {user_id},
            });

        return res.json(user_settings);
    },

    async store(req, res) {
        const user_id = req.params.id;

        const {
            notification_comments,
            notification_follower,
            notification_mentions
        } = req.body;

        const user_settings = await UserSettings.create({
            user_id,
            notification_comments,
            notification_follower,
            notification_mentions
        });

        return res.json(user_settings);
    },

    async update(req, res) {
        const user_id = req.params.id;

        const {
            notification_comments,
            notification_follower,
            notification_mentions
        } = req.body;

        console.log(req.body);

        const user_settings = await UserSettings.update(
            {
                notification_comments,
                notification_follower,
                notification_mentions
            },
            { where: { user_id } }
        );

        return res.json(user_settings);
    },
}