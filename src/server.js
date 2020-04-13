const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

require('./database');

//Carregar as variáveis de enviromnent.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({
        path: ".env"
    });
}

//Iniciando o app
const app = express();

//Usando as politicas de acesso do cors
app.use(cors());
//Permitir que a aplicação receba requisições em formato json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Instalar middleware do Body Parser

//Referenciar as controllers (Rotas da api)
require('./app')(app);


//Porta que será usada pela API.
app.listen(process.env.PORT);