module.exports.initAdminDbConnection = DB_NAME =>{
 //any mongoDB connection
 //DB_URL -> make connection to DB_URL and return connection object
 return require(`./database/${DB_NAME}.json`)
}