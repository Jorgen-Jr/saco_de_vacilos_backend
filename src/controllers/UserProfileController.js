const UserProfile = require('../models/UserProfile');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    async indexByPk(req, res) {
        const user_id = req.params.id;

        const user_profile = await UserProfile.findAll(
            {
                where: {user_id},
            });

        return res.json(user_profile);
    },

    async store(req, res) {
        const user_id = req.params.id;

        const {
            surname,
            bio,
            profile_picture
        } = req.body;

        const user_profile = await UserProfile.create({
            user_id,
            surname,
            bio,
            profile_picture
        });

        return res.json(user_profile);
    },

    async update(req, res) {
        const user_id = req.params.id;

        const {
            surname,
            bio,
            profile_picture
        } = req.body;

        console.log(req.body);

        const user_profile = await UserProfile.update(
            {
                user_id,
                surname,
                bio,
                profile_picture
            },
            { where: { user_id } }
        );

        return res.json(user_profile);
    },
}