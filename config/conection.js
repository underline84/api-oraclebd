require('dotenv').config();

const connAttrsOracle = {
    user: process.env.USER_ORACLE,
    password: process.env.PASS_ORACLE,
    connectString: process.env.URL_ORACLE
}

const connAttrsOracleTasy = {
    user: process.env.USER_ORACLE_TASY,
    password: process.env.PASS_ORACLE_TASY,
    connectString: process.env.URL_ORACLE_TASY
}

const connAttrsAD = {
    url: process.env.AD_URL,
    baseDN: process.env.DOMAIN_CONTROLLER,
    username: process.env.AD_USERNAME,
    password: process.env.AD_PASS
    
}

const connAttrsMySQLIntranet = {
    host: process.env.URL_MYSQL_INTRANET,
    user: process.env.USER_MYSQL_INTRANET,
    password: process.env.PASS_MYSQL_INTRANET,
    database: process.env.DB_MYSQL_INTRANET
}

 module.exports = { connAttrsOracle:        connAttrsOracle, 
                    connAttrsOracleTasy:    connAttrsOracleTasy,
                    connAttrsAD:            connAttrsAD,
                    connAttrsMySQLIntranet: connAttrsMySQLIntranet }; 
                 