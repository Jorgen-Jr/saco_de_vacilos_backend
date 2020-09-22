import { Request, Response } from "express";
import { Op, Sequelize } from '../../node_modules/sequelize/types/index';

const PostUserAction = require('../models/PostUserAction');

module.exports = {
    async store(req: Request, res: Response) {
        const post_id = parseInt(req.params.id);

        const {
            user_id,
            action,
        } = req.body;

        const post_action = await PostUserAction.create({
            post_id,
            user_id,
            action,
        }).catch((err: any) => {
            return res.status(500).json({ message: err.message })
        });

        return res.json(post_action);
    },

    async update(req: Request, res: Response) {
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