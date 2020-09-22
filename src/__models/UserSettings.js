const { DataTypes, Model } = require('sequelize');

class UserSettings extends Model {
    static init(sequelize) {
        super.init({
            user_id: DataTypes.INTEGER,
            notification_comments: DataTypes.BOOLEAN,
            notification_follower: DataTypes.BOOLEAN,
            notification_mentions: DataTypes.BOOLEAN,
        }, {
            sequelize,
            modelName: 'user_settings',
            tableName: 'user_settings',
            freezeTableName: true,
            underscored: true,
        }
        );
    }
    static associate(models) {
        this.belongsTo(models.user, {
            foreignKey: 'user_id',
            as: 'user_settings'
        });
    }
}

module.exports = UserSettings;