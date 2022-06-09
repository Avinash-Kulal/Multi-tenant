const { getNamespace } = require("continuation-local-storage");
const { initAdminDbConnection } = require('./adminDbConnection')
const { initTenantDbConnection } = require('./tenantDbConnection')

let adminDbConnection, connectionMap;

const connectAllDb = async () => {
 //connectionMap = getAllTenants();
 adminDbConnection = initAdminDbConnection(process.env.ADMIN_DB_NAME);
 connectionMap =  adminDbConnection.tenants
   .map(tenant => {
    return { [tenant.name]: initTenantDbConnection(tenant.dbURI) }
   }).reduce((prev, next,) => {
    return Object.assign({}, prev, next)
   },{})
}

const getConnectionByTenant = tenantName => {
 return connectionMap[tenantName];
}

const getAdminConnection = () => {
 return adminDbConnection ? adminDbConnection : undefined;
}

const getConnection = () => {
 const nameSpace = getNamespace("unique context");
 const conn = nameSpace.get("connection");
 if (!conn) {   
  throw new Error("Connection is not set for any tenant database");
 }
 return conn;
}
const getConnectionMap=()=>{
  return connectionMap;
}
module.exports = {
 connectAllDb,
 getAdminConnection,
 getConnection,
 getConnectionByTenant,
 getConnectionMap
};