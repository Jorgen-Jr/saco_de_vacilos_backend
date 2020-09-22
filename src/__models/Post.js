const { DataTypes, Model } = require('sequelize');

class Post extends Model {
    static init(sequelize) {
        super.init({
            author_id: DataTypes.INTEGER,
            guilty_id: DataTypes.INTEGER,
            content: DataTypes.STRING,
            initial_balance: DataTypes.FLOAT,
            status: DataTypes.CHAR,
            deserved_count: DataTypes.INTEGER,
            undeserved_count: DataTypes.INTEGER,
            view_count: DataTypes.INTEGER,
        }, {
            sequelize,
            modelName: 'post',
            tableName: 'post',
            freezeTableName: true,
            underscored: true,
        }
        );
    }
    static associate(models) {
        this.belongsTo(models.user, {
            foreignKey: 'author_id',
            as: 'author'
        });
        this.belongsTo(models.user, {
            foreignKey: 'guilty_id',
            as: 'guilty'
        });
        this.hasMany(models.post_comment, {
            foreignKey: 'id',
            as: 'comments'
        });
        this.hasMany(models.post_user_action, {
            foreignKey: 'id',
            as: 'actions'
        });
    }
}

module.exports = Post;