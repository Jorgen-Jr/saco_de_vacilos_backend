const { DataTypes, Model } = require('sequelize');

class Role extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            desc: DataTypes.STRING,
            active: DataTypes.BOOLEAN,
        }, {
            hooks: {
                beforeCreate: role => {
                    role.active = true;
                },
            },
            sequelize,
            modelName: 'role',
            tableName: 'role',
            freezeTableName: true,
            underscored: true,
        }
        );
    }
    static associate(models) {
        this.belongsToMany(models.user, {
            foreignKey: 'role_id',
            through: 'user_roles',
            as: 'users'
        });
    }
}

module.exports = Role;