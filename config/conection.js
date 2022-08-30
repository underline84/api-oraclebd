require('dotenv').config();

const connAttrsOracle = {
    "user": process.env.USER_ORACLE,
    "password": process.env.PASS_ORACLE,
    "connectString": process.env.URL_ORACLE
}

module.exports = connAttrsOracle;