const { DataTypes, Model } = require('sequelize');

class Post extends Model {
    static init(sequelize) {
        super.init({
            user_id: DataTypes.INTEGER,
            post_id: DataTypes.INTEGER,
            content: DataTypes.STRING,
        }, {
            sequelize,
            modelName: 'post_comment',
            tableName: 'post_comment',
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

module.exports = Post;