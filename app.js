const express = require('express');
const app = express();

//require('dotenv').config();

const clientesRoute = require('./routes/clientes.route');
const pessoasRoute = require('./routes/pessoa.route');
const loginAD = require('./routes/login.ad.route');

app.use('/clientes', clientesRoute);
app.use('/pessoas', pessoasRoute);
app.use('/ad', loginAD);

//console.log(process.env.DOMAIN_CONTROLLER);

const server = app.listen(5000, () => {
    var host = server.address().address,
        port = server.address().port;

    console.log(' Server is listening at http://%s:%s', host, port);
})


