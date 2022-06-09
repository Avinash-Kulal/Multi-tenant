const { initAdminDbConnection } = require('../adminDbConnection')
const { initTenantDbConnection } = require('../tenantDbConnection')
const fs = require('fs');
const { getConnectionMap } = require("../connectionManager")
module.exports = {
  getAllTenants: function () {
    const adminDbConnection = initAdminDbConnection(process.env.ADMIN_DB_NAME);
    return adminDbConnection.tenants
      .map(tenant => {
        return { [tenant.name]: initTenantDbConnection(tenant.dbURI) }
      }).reduce((prev, next) => {
        return Object.assign({}, prev, next)
      }, {})
  },

  createTenant: function (data) {
    const name = data.name;
    const fileName = `./../database/${process.env.ADMIN_DB_NAME}.json`;
    const admin_db = require(fileName);
    const new_tenant = { "name": name, "dbURI": name };
    admin_db.tenants.push(new_tenant)
    fs.writeFile(`database/${process.env.ADMIN_DB_NAME}.json`, JSON.stringify(admin_db), function writeJSON(err) {
      if (err) return console.log(err);
      fs.writeFile(`database/${name}.json`, JSON.stringify({
        "name": `${name}`,
        "users": [
        ]
      }), function (err) {
        if (err) console.log(err)
        getConnectionMap()[name] = initTenantDbConnection(name)
      })
    })
    return new_tenant;
  }
}