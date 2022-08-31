const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const { connAttrsOracleTasy } = require('../config/conection');


// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// Use body parser to parse JSON body
router.use(bodyParser.json());

// Http Method: GET
// URI        : /pessoas
// Read all the pessoas
router.get('/', function (req, res, next) {
    "use strict";

    oracledb.getConnection(connAttrsOracleTasy, function (err, connection) {
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

        connection.execute("SELECT * FROM pessoa_fisica", {}, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error getting the pessoas",
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
                        console.log("GET /pessoas : Connection released");
                    }
                });
        });
    });
});


// Http method: GET
// URI        : /pessoa/:CD_PESSOA_FISICA
// Read the profile of cliente given in :CD_PESSOA_FISICA
router.get('/:CD_PESSOA_FISICA', function (req, res, next) {
    "use strict";

    oracledb.getConnection(connAttrsOracleTasy, function (err, connection) {
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

        connection.execute("SELECT * FROM pessoa_fisica WHERE CD_PESSOA_FISICA = :CD_PESSOA_FISICA", [req.params.CD_PESSOA_FISICA], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the pessoa" : "pessoa doesn't exist",
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
                        console.log("GET /pessoas/" + req.params.CD_PESSOA_FISICA + " : Connection released");
                    }
                });
        });
    });
});

module.exports = router;