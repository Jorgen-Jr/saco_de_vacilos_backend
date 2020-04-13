const PostComment = require('../models/PostComment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    async search(req, res) {
        const { query } = req.body;

        const results = await PostComment.findAll({
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

    async index(req, res) {
        const post_comment = await PostComment.findAll();

        return res.json(post_comment);
    },

    async indexByPk(req, res) {
        const post_id = req.params.id;

        const post_comment = await Post.findByPk(post_id, {
            include: [{
                association: 'user',
            },{
                association: 'post',
            }]
        });

        return res.json(post_comment);
    },

    async store(req, res) {
        const post_id = parseInt(req.params.id);

        const {
            user_id,
            content,
        } = req.body;

        const post = await PostComment.create({
            user_id,
            post_id,
            content,
        }).catch(err => {
            return res.status(500).json({ message: err.message })
        });

        return res.json(post);
    },

    async update(req, res) {
        const post_id = parseInt(req.params.id);

        const {
            user_id,
            content,
        } = req.body;

        const post = await PostComment.update(
            {
                user_id,
                post_id,
                content,
            },
            { where: { id: post_id } }
        );

        return res.json(post);
    },

    async delete(req, res) {
        const id = req.params.id;

        const response = await PostComment.destroy({
            where: {
                id: id
            }
        });

        return res.json(response);
    },
}