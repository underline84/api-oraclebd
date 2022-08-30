const express = require('express');
const app = express();

const clientesRoute = require('./routes/clientes.route');

app.use('/clientes', clientesRoute);

const server = app.listen(5000, () => {
    var host = server.address().address,
        port = server.address().port;

    console.log(' Server is listening at http://%s:%s', host, port);
})