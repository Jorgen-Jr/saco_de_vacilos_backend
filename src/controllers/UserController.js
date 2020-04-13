const User = require('../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SESSION_SECRET } = require('../util/secrets');

module.exports = {

    async index(req, res) {
        const users = await User.findAll();
        users.map(item => {
            item.password_hash = undefined;
        })

        return res.json(users);
    },

    async indexByPk(req, res) {
        const user_id = req.params.id;

        const user = await User.findByPk(user_id, {
            include: [{
                association: 'roles',
                attributes: ['name', 'desc'],
                through: {
                },
            }, {
                association: 'settings'
            },{
                association: 'profile'
            }
        ]});

        user.password_hash = undefined;

        return res.json(user);
    },

    async search(req, res) {
        const { query } = req.body;

        const results = await User.findAll({
            where: Sequelize.or(
                {
                    username: {
                        [Op.like]: '%' + query + '%'
                    }
                },
                {
                    name: {
                        [Op.like]: '%' + query + '%'
                    }
                },
                {
                    email: {
                        [Op.like]: '%' + query + '%'
                    }
                }
            )
        });
        return res.json(results);
    },
    
    async store(req, res) {
        const { name, email, username, password } = req.body;

        const user = await User.create({ name, email, username, password });

        return res.json(user);
    },
    
    async update(req, res) {
        const { name, email, username, password } = req.body;
        const user_id  = req.params.id;
        
        console.log(req.body);
        password_hash = await bcrypt.hash(password, 8);
        const user = await User.update(
            { name, email, username, password_hash },
            { where: { id: user_id }}
            );

        return res.json(user);
    },

    async login(req, res) {
        const { username, password } = req.body;

        const user = await User.findOne({
            where: { username },
            include: [{
                association: 'roles',
                attributes: ['name', 'desc'],
                through: {
                },
            }, {
                association: 'settings'
            },{
                association: 'profile'
            }]
        });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if(!(await bcrypt.compare(password, user.password_hash))){
            return res.status(400).json({ error: 'Incorrect password' })
        }

        user.password_hash = undefined;

        const generateToken = jwt.sign({ user_id: user.id }, SESSION_SECRET, {
            expiresIn: 60 * 60 * 24,
        });
        
        return res.json({
            user,
            token: generateToken
        });
    },

    async isUsernameAvailable(req, res){
        const username = req.params.new_username;

        const check_username = await User.findOne({
            where: { username }
        });

        if(check_username){
            return res.json(false);
        }

        return res.json(true);
    },

    async isLoginExpired(req, res){
        const user_id = req.params.id;

        const user = await User.findByPk(user_id);
        user.email = undefined;
        user.nome = undefined;
        user.password_hash = undefined;

        return res.json(user);
    }
}