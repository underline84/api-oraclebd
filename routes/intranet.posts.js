const mysql = require("mysql2/promise");
const { connAttrsMySQLIntranet } = require("../config/conection");



// (async () => {
//     console.log('entrei');
//     try {
//         let pool = await mysql.connect(connAttrsMySQLIntranet);     
//         console.log(poll); 
//         const list = await pool.request().query("SELECT * FROM postagem");
//         console.log(list.recordset);
        
//     } catch (error) {
//         return error.message;
//     }
// })();

(async () => {

    // create the pool
    const pool = mysql.createPool();
    // now get a Promise wrapped instance of that pool
    const promisePool = pool.promise();
    // query database using promises
    const list = await promisePool.query("SELECT * FROM video_views");

    console.log(list);    

})();
