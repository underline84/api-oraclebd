const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const connAttrsOracle = require('../config/conection');

// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// Use body parser to parse JSON body
router.use(bodyParser.json());

// Http Method: GET
// URI        : /clientes
// Read all the clientes
router.get('/', function (req, res, next) {
    "use strict";

    oracledb.getConnection(connAttrsOracle, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }

        connection.execute("select * from tabela_de_clientes", {}, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error getting the clientes",
                    detailed_message: err.message
                }));
            } else {
                res.contentType('application/json').status(200);
                res.send(JSON.stringify(result.rows));
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /clientes : Connection released");
                    }
                });
        });
    });
});


// Http method: GET
// URI        : /clientes/:CPF
// Read the profile of cliente given in :CPF
router.get('/:CPF', function (req, res, next) {
    "use strict";

    oracledb.getConnection(connAttrsOracle, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }

        connection.execute("SELECT * FROM tabela_de_clientes WHERE CPF = :CPF", [req.params.CPF], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the cliente" : "cliente doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /clientes/" + req.params.CPF + " : Connection released");
                    }
                });
        });
    });
});


// Http method: POST
// URI        : /clientes
// Creates a new cliente
router.post('/', function (req, res, next) {
    "use strict";
    if ("application/json" !== req.get('Content-Type')) {
        res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
            status: 415,
            message: "Wrong content-type. Only application/json is supported",
            detailed_message: null
        }));
        return;
    }
    oracledb.getConnection(connAttrsOracle, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        connection.execute("INSERT INTO tabela_de_clientes VALUES " +
            "(:CPF, :NOME, :ENDERECO_1, :ENDERECO_2," +
            ":BAIRRO, :CIDADE, :ESTADO, :CEP, TO_DATE(:DATA_DE_NASCIMENTO,'DD/MM/YYYY'), :IDADE," +
            ":SEXO, :LIMITE_DE_CREDITO, :VOLUME_DE_COMPRA, :PRIMEIRA_COMPRA)",
            [req.body.CPF, req.body.NOME,
            req.body.ENDERECO_1, req.body.ENDERECO_2, req.body.BAIRRO, req.body.CIDADE,
            req.body.ESTADO, req.body.CEP, req.body.DATA_DE_NASCIMENTO, req.body.IDADE,
            req.body.SEXO, req.body.LIMITE_DE_CREDITO, req.body.VOLUME_DE_COMPRA,
            req.body.PRIMEIRA_COMPRA], {
            autoCommit: true,
            outFormat: oracledb.OBJECT // Return the result as Object
        },
            function (err, result) {
                if (err) {
                    // Error
                    res.set('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err.message.indexOf("ORA-00001") > -1 ? "User already exists" : "Input Error",
                        detailed_message: err.message
                    }));
                } else {
                    // Successfully created the resource
                    res.status(201).set('Location', '/clientes/' + req.body.CPF).end();
                }
                // Release the connection
                connection.release(
                    function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("POST /clientes : Connection released");
                        }
                    });
            });
    });
});

// Build UPDATE statement and prepare bind variables
var buildUpdateStatement = function buildUpdateStatement(req) {
    "use strict";

    var statement = "",
        bindValues = {};

    if (req.body.CPF) {
        statement += "CPF = :CPF";
        bindValues.CPF = req.body.CPF;
    }

    if (req.body.NOME) {
        if (statement) statement = statement + ", ";
        statement += "NOME = :NOME";
        bindValues.NOME = req.body.NOME;
    }
    if (req.body.ENDERECO_1) {
        if (statement) statement = statement + ", ";
        statement += "ENDERECO_1 = :ENDERECO_1";
        bindValues.ENDERECO_1 = req.body.ENDERECO_1;
    }
    if (req.body.ENDERECO_2) {
        if (statement) statement = statement + ", ";
        statement += "ENDERECO_2 = :ENDERECO_2";
        bindValues.ENDERECO_2 = req.body.ENDERECO_2;
    }
    if (req.body.BAIRRO) {
        if (statement) statement = statement + ", ";
        statement += "BAIRRO = :BAIRRO";
        bindValues.BAIRRO = req.body.BAIRRO;
    }
    if (req.body.CIDADE) {
        if (statement) statement = statement + ", ";
        statement += "CIDADE = :CIDADE";
        bindValues.CIDADE = req.body.CIDADE;
    }
    if (req.body.ESTADO) {
        if (statement) statement = statement + ", ";
        statement += "ESTADO = :ESTADO";
        bindValues.ESTADO = req.body.ESTADO;
    }
    if (req.body.CEP) {
        if (statement) statement = statement + ", ";
        statement += "CEP = :CEP";
        bindValues.CEP = req.body.CEP;
    }
    if (req.body.DATA_DE_NASCIMENTO) {
        if (statement) statement = statement + ", ";
        statement += "DATA_DE_NASCIMENTO = TO_DATE(:DATA_DE_NASCIMENTO,'DD/MM/YYYY')";
        bindValues.DATA_DE_NASCIMENTO = req.body.DATA_DE_NASCIMENTO;
    }
    if (req.body.IDADE) {
        if (statement) statement = statement + ", ";
        statement += "IDADE = :IDADE";
        bindValues.IDADE = req.body.IDADE;
    }
    if (req.body.SEXO) {
        if (statement) statement = statement + ", ";
        statement += "SEXO = :SEXO";
        bindValues.SEXO = req.body.SEXO;
    }
    if (req.body.LIMITE_DE_CREDITO) {
        if (statement) statement = statement + ", ";
        statement += "LIMITE_DE_CREDITO = :LIMITE_DE_CREDITO";
        bindValues.LIMITE_DE_CREDITO = req.body.LIMITE_DE_CREDITO;
    }
    if (req.body.VOLUME_DE_COMPRA) {
        if (statement) statement = statement + ", ";
        statement += "VOLUME_DE_COMPRA = :VOLUME_DE_COMPRA";
        bindValues.VOLUME_DE_COMPRA = req.body.VOLUME_DE_COMPRA;
    }
    if (req.body.PRIMEIRA_COMPRA) {
        if (statement) statement = statement + ", ";
        statement += "PRIMEIRA_COMPRA = :PRIMEIRA_COMPRA";
        bindValues.PRIMEIRA_COMPRA = req.body.PRIMEIRA_COMPRA;
    }

    statement += " WHERE CPF = :CPF";
    bindValues.CPF = req.params.CPF;
    statement = "UPDATE tabela_de_clientes SET " + statement;

    console.table(statement);
    console.table(bindValues);

    return {
        statement: statement,
        bindValues: bindValues
    };
};



// Http method: PUT
// URI        : /clientes/:CPF
// Update the cliente of user given in :CPF
router.put('/:CPF', function (req, res) {
    "use strict";

    if ("application/json" !== req.get('Content-Type')) {
        res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
            status: 415,
            message: "Wrong content-type. Only application/json is supported",
            detailed_message: null
        }));
        return;
    }

    oracledb.getConnection(connAttrsOracle, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }

        var updateStatement = buildUpdateStatement(req);
        connection.execute(updateStatement.statement, updateStatement.bindValues, {
            autoCommit: true,
            outFormat: oracledb.OBJECT // Return the result as Object
        },
            function (err, result) {
                if (err || result.rowsAffected === 0) {
                    // Error
                    res.set('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err ? "Input Error" : "User doesn't exist",
                        detailed_message: err ? err.message : ""
                    }));
                } else {
                    // Resource successfully updated. Sending an empty response body. 
                    res.status(204).end();
                }
                // Release the connection
                connection.release(
                    function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("PUT /clientes/" + req.params.CPF + " : Connection released ");
                        }
                    });
            });
    });
});

// Http method: DELETE
// URI        : /clientes/:CPF
// Delete the profile of user given in :CPF
router.delete('/:CPF', function (req, res, next) {
    "use strict";

    oracledb.getConnection(connAttrsOracle, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }

        connection.execute("DELETE FROM tabela_de_clientes WHERE CPF = :CPF", [req.params.CPF], {
            autoCommit: true,
            outFormat: oracledb.OBJECT
        }, function (err, result) {
            if (err || result.rowsAffected === 0) {
                // Error
                res.set('Content-Type', 'application/json');
                res.status(400).send(JSON.stringify({
                    status: 400,
                    message: err ? "Input Error" : "User doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                // Resource successfully deleted. Sending an empty response body. 
                res.status(204).end();
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("DELETE /clientes/" + req.params.CPF + " : Connection released");
                    }
                });

        });
    });
});

module.exports = router;




