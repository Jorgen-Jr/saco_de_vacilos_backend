import { Request, Response } from "express";
import { Op, Sequelize } from '../../node_modules/sequelize/types/index';

const Role = require('../models/Role');
const User = require('../models/User');

module.exports = {
    async index(req: Request, res: Response) {

        const role = await Role.findAll();

        return res.json(role);
    },

    async user_index(req: Request, res: Response) {
        const role = await Role.findAll();

        return res.json(role);
    },

    async store(req: Request, res: Response) {
        const { user_id } = req.params;
        const { name, desc } = req.body;

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(400).json({ error: 'User not found.' })
        }

        const role = await Role.findOrCreate(
            {where: { name, desc }}
        );

        await user.addRole(role);

        return res.json(role);

    },

    async update(req: Request, res: Response) {
        const id = req.params.role_id;
        const { name, desc } = req.body;

        const role = await Role.update({
            name, desc
        });

    },

    async delete(req: Request, res: Response) {
        const { user_id } = req.params;
        const { name, desc } = req.body;

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(400).json({ error: 'User not found.' })
        }

        const role = await Role.findOne({
            where: { name }
        });

        await user.removeRole(role);

        return res.json(user);
    },
}