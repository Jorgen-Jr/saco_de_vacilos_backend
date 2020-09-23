import { Request, Response } from "express";
import { Op, Sequelize } from '../../node_modules/sequelize/types/index';

const UserSettings = require('../models/UserSettings');

module.exports = {
    async indexByPk(req: Request, res: Response) {
        const user_id = req.params.id;

        const user_settings = await UserSettings.findAll(
            {
                where: {user_id},
            });

        return res.json(user_settings);
    },

    async store(req: Request, res: Response) {
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

    async update(req: Request, res: Response) {
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