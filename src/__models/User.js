const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
    static init(sequelize) {
        super.init({
            username: DataTypes.STRING,
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.VIRTUAL,
            password_hash: DataTypes.STRING,
            active: DataTypes.BOOLEAN,
        }, {
            hooks: {
                beforeCreate: user => {
                    user.active = true;
                },
                beforeSave: async user => {
                    if (user.password) {
                        user.password_hash = await bcrypt.hash(user.password, 8);
                    }
                },
            },
            sequelize,
            modelName: 'user',
            tableName: 'user',
            freezeTableName: true,
            underscored: true,
            //paranoid: true,
        }
        );
    }
    static associate(models) {
        this.belongsToMany(models.role, {
            foreignKey: 'user_id',
            through: 'user_roles',
            as: 'roles'
        });
        this.hasOne(models.user_profile, {
            foreignKey: 'user_id',
            as: 'profile'
        });
        this.hasOne(models.user_settings, {
            foreignKey: 'user_id',
            as: 'settings'
        });
        this.hasMany(models.following_relationship, {
            foreignKey: 'user_id',
            as: 'following'
        });
    }


}

module.exports = User;