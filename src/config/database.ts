//Carregar as variáveis de enviromnent.
if (process.env.NODE_ENV !== 'production') {
    if (process.env.NODE_ENV === 'test') {
        require('dotenv').config({
            path: '.env.test',
        });
    }
  }

module.exports = {
    host: process.env.DB_URI || 'localhost',
    port: process.env.DB_PORT || '3336',
    dialect: process.env.DB_DIALECT || 'mysql',
    storage: "./__tests__/database.sqlite",
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '@!Pass',
    database: process.env.DB_DATABASE || 'DB_SACO_DE_VACILOS',
    logging: false,
    define: {
        timestamps: true,
        underscore: true,
        underscoreAll: true,
        freezeTableName: true,
    }
};