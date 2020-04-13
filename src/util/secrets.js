if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');    
    dotenv.config({ path: ".env" });
}

const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Se não for produção, será sempre de homologação

const SESSION_SECRET = process.env["SESSION_SECRET"];
const DB_URI = prod ? process.env["DB_URI"] : process.env["DB_URI_LOCAL"];

if (!SESSION_SECRET) {
    // logger.error("No client secret. Set SESSION_SECRET environment variable.");
    console.log('Sem secret do cliente, favor informar o SESSION_SECRET nas variáveis de ambiente.');
    process.exit(1);
}

if (!DB_URI) {
    if (prod) {
        // logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    console.log('Sem endereço de conexão com o banco de dados. favor informar o DB_URL nas variáveis de ambiente.');
    } else {
        // logger.error("No mongo connection string. Set MONGODB_URI_LOCAL environment variable.");
    console.log('Sem endereço de conexão com o banco de dados. favor informar o DB_URI_LOCAL nas variáveis de ambiente.');
    }
    process.exit(1);
}

module.exports = {SESSION_SECRET, DB_URI};