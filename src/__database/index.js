const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../__models/User');
const Role = require('../__models/Role');
const UserSettings = require('../__models/UserSettings');
const FollowingRelationship = require('../__models/FollowingRelationship');
const UserProfile = require('../__models/UserProfile');
const Post = require('../__models/Post');
const PostComment = require('../__models/PostComment');
const PostUserAction = require('../__models/PostUserAction');

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