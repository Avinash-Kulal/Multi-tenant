const { createNamespace } = require("continuation-local-storage");
const { getConnectionByTenant, getAdminConnection } = require("./connectionManager");

let nameSpace = createNamespace("unique context");

const resolveTenant = (req, res, next) => {
 const tenant = req.query.tenant;
 if (!tenant) {
  return res
   .status(500)
   .json({ error: `Please provide tenant's name in query parameter to connect` });
 }

 nameSpace.run(() => {
  const tenantDbConnection = getConnectionByTenant(tenant);
  nameSpace.set('connection', tenantDbConnection);
  next();
 })
}

const setAdminDb = (req,res,next)=>{
 nameSpace.run(()=>{
  const adminDbConnection = getAdminConnection();
  nameSpace.set('connection',adminDbConnection);
  next();
 })
}
module.exports = {resolveTenant,setAdminDb};