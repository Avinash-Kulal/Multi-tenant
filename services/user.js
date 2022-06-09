const fs = require("fs");

module.exports = {
 createUser: function (tenant, data) {
  const fileName = `./../database/${tenant}.json`
  const tenantDb = require(fileName);
  tenantDb.users.push(data);
  fs.writeFile(`database/${tenant}.json`, JSON.stringify(tenantDb), function writeJSON(err) {
   if (err) return err;
   return true;
  })
 }
}