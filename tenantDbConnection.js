module.exports.initTenantDbConnection = DB_NAME =>{
 return require(`./database/${DB_NAME}.json`)
}