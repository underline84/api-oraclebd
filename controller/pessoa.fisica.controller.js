const oracledb = require('oracledb');
const { connAttrsOracleTasy } = require('../config/conection');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


async function getPessoaFisica(id, table, columm) {

    let connection;

    try {

        connection = await oracledb.getConnection(connAttrsOracleTasy);

        const result = await connection.execute(`SELECT * FROM ${table} WHERE ${columm} = :id`, [id]);
        
        //console.log(result.rows);

        return result.rows;

    } catch (error) {
        console.log(error);
    } finally {
        if (connection) {
            try {
                await connection.release();
                console.log('Connection released!');
            
            } catch (e) {
                console.error(e);
            }
        }
    }
}

//getPessoaFisica(545, 'pessoa_fisica', 'CD_PESSOA_FISICA');

module.exports = getPessoaFisica;