const Sequelize  = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../models/User');
const Role = require('../models/Role');
const UserSettings = require('../models/UserSettings');
const FollowingRelationship = require('../models/FollowingRelationship');
const UserProfile = require('../models/UserProfile');
const Post = require('../models/Post');
const PostComment = require('../models/PostComment');
const PostUserAction = require('../models/PostUserAction');

const connection = new Sequelize(dbConfig);

User.init(connection);
Role.init(connection);

UserSettings.init(connection);
FollowingRelationship.init(connection);
UserProfile.init(connection);

Post.init(connection);
PostComment.init(connection);
PostUserAction.init(connection);

User.associate(connection.models);
Role.associate(connection.models);

UserSettings.associate(connection.models);
FollowingRelationship.associate(connection.models);
UserProfile.associate(connection.models);

Post.associate(connection.models);
PostComment.associate(connection.models);
PostUserAction.associate(connection.models);

module.exports = connection;