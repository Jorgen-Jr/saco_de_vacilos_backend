import { Request, Response } from "express";
import { Op, Sequelize } from '../../node_modules/sequelize/types/index';

const UserProfile = require('../models/UserProfile');

module.exports = {
    async indexByPk(req: Request, res: Response) {
        const user_id = req.params.id;

        const user_profile = await UserProfile.findAll(
            {
                where: {user_id},
            });

        return res.json(user_profile);
    },

    async store(req: Request, res: Response) {
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

    async update(req: Request, res: Response) {
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