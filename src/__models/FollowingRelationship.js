const { DataTypes, Model } = require('sequelize');

class FollowingRelationship extends Model {
    static init(sequelize) {
        super.init({
            user_id: DataTypes.INTEGER,
            following_id: DataTypes.INTEGER,
        }, {
            sequelize,
            modelName: 'following_relationship',
            tableName: 'following_relationship',
            freezeTableName: true,
            underscored: true,
        }
        );
    }
    static associate(models) {
        this.belongsTo(models.user, {
            foreignKey: 'user_id',
            as: 'following_relationship'
        });
    }
}

module.exports = FollowingRelationship;