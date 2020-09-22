const Post = require('../models/Post');
import { Response, Request } from 'express';
import { Op, Sequelize } from '../../node_modules/sequelize/types/index';

module.exports = {
    async search(req: Request, res: Response) {
        const { query } = req.body;

        const results = await Post.findAll({
            where: Sequelize.or(
                {
                    nome: {
                        [Op.like]: '%' + query + '%'
                    }
                },
                {
                    descricao: {
                        [Op.like]: '%' + query + '%'
                    }
                },
            )
        });

        return res.json(results);
    },

    async index(req: Request, res: Response) {
        const post = await Post.findAll(
            {
                include: [{
                    association: 'comments',
                }, {
                    association: 'author',
                    attributes: ['name', 'username'],
                    include:[{
                        association: 'profile'
                    }]
                }, {
                    association: 'guilty',
                    attributes: ['name', 'username']
                }, {
                    association: 'actions',
                }]
            });

        return res.json(post);
    },

    async indexByPk(req: Request, res: Response) {
        const post_id = req.params.id;

        const post = await Post.findByPk(post_id, {
            include: [{
                association: 'comments',
            },{
                association: 'author',
                attributes: ['name','username']
            },{
                association: 'guilty',
                attributes: ['name','username']
            },{
                association: 'actions',
            }]
        });

        return res.json(post);
    },

    async store(req: Request, res: Response) {
        const author_id = parseInt(req.params.id);

        const {
            guilty_id,
            content,
            initial_balance,
            status,
            deserved_count,
            undeserved_count,
            view_count,
        } = req.body;

        const post = await Post.create({
            author_id,
            guilty_id,
            content,
            initial_balance,
            status,
            deserved_count,
            undeserved_count,
            view_count,
        }).catch((err: any) => {
            return res.status(500).json({ message: err.message })
        });

        return res.json(post);
    },

    async update(req: Request, res: Response) {
        const post_id = req.params.id;

        const {
            content,
            initial_balance,
            status,
            deserved_count,
            undeserved_count,
            view_count,
        } = req.body;

        const post = await Post.update(
            {
                content,
                initial_balance,
                status,
                deserved_count,
                undeserved_count,
                view_count,
            },
            { where: { id: post_id } }
        );

        return res.json(post);
    },

    async delete(req: Request, res: Response) {
        const id = req.params.id;

        const response = await Post.destroy({
            where: {
                id: id
            }
        });

        return res.json(response);
    },

    async byAuthor(req: Request, res: Response) {
        const author_id = req.params.id;

        const post = await Post.findAll({
            where: {author_id},
            include: [{
                association: 'comments',
                include:[{
                    association: 'user',
                    attributes: ['name','username']
                }]
            },{
                association: 'author',
                attributes: ['name','username']
            },{
                association: 'guilty',
                attributes: ['name','username']
            },{
                association: 'actions',
            }]
        });

        return res.json(post);
    },

    async byGuilty(req: Request, res: Response) {
        const guilty_id = req.params.id;

        const post = await Post.findAll({
            where: {guilty_id},
            include: [{
                association: 'comments',
            },{
                association: 'author',
                attributes: ['name','username']
            },{
                association: 'guilty',
                attributes: ['name','username']
            },{
                association: 'actions',
            }]
        });

        return res.json(post);
    },
}