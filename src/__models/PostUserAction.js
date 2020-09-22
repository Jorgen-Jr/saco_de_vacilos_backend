const { DataTypes, Model } = require('sequelize');

class PostUserAction extends Model {
    static init(sequelize) {
        super.init({
            user_id: DataTypes.INTEGER,
            post_id: DataTypes.INTEGER,
            action: DataTypes.CHAR,
        }, {
            sequelize,
            modelName: 'post_user_action',
            tableName: 'post_user_action',
            freezeTableName: true,
            underscored: true,
        }
        );
    }
    static associate(models) {
        this.belongsTo(models.user, {
            foreignKey: 'user_id',
            as: 'user'
        });
        this.belongsTo(models.post, {
            foreignKey: 'post_id',
            as: 'post'
        });
    }
}

module.exports = PostUserAction;