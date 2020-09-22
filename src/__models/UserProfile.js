const { DataTypes, Model } = require('sequelize');

class UserProfile extends Model {
    static init(sequelize) {
        super.init({
            user_id: DataTypes.INTEGER,
            surname: DataTypes.STRING,
            bio: DataTypes.STRING,
            profile_picture: DataTypes.STRING,
        }, {
            sequelize,
            modelName: 'user_profile',
            tableName: 'user_profile',
            freezeTableName: true,
            underscored: true,
        }
        );
    }
    static associate(models) {
        this.belongsTo(models.user, {
            foreignKey: 'user_id',
            as: 'user_profile'
        });
    }


}

module.exports = UserProfile;