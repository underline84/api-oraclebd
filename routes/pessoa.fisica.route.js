const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const { connAttrsOracleTasy } = require('../config/conection');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Use body parser to parse JSON body
router.use(bodyParser.json());

// Http Method: GET
// URI        : /pessoas
// Read all the pessoas
router.get('/:CD_PESSOA_FISICA', function (req, res, next) {
    "use strict";

    (async () => {

        let connection;

        try {
            connection = await oracledb.getConnection(connAttrsOracleTasy);

            const result = await connection.execute(
                "SELECT * FROM pessoa_fisica WHERE CD_PESSOA_FISICA = :CD_PESSOA_FISICA",
                [req.params.CD_PESSOA_FISICA]);
            
                if (result.rows.length < 1) {
                    res.set('Content-Type', 'application/json');                    
                    res.status(404).send(JSON.stringify({
                        status: 404,
                        message: "pessoa doesn't exist"                        
                    }));

                } else {
                    res.contentType('application/json').status(200).send(JSON.stringify(result.rows));
                }                

        } catch (err) {
            if (err || result.rows.length < 1) {
                res.set('Content-Type', 'application/json');
                var status = err ? 500 : 404;
                res.status(status).send(JSON.stringify({
                    status: status,
                    message: err ? "Error getting the pessoa" : "pessoa doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            }
        } finally {
            if (connection) {
                try {
                    await connection.release();
                    console.log("GET /pessoas/" + req.params.CD_PESSOA_FISICA + " : Connection oracle released");

                } catch (e) {
                    console.error(e);
                }
            }
        }
    })();
});

module.exports = router;