const express = require("express");
const app = express();
require("dotenv-defaults").config();

app.use(express.json())
// connection resolver for tenant
const connectionResolver = require("./connectionResolver");
const {connectAllDb,getConnection} = require("./connectionManager")
connectAllDb();//initiate connection to all tenants db and cache it in connection map

const {getAllTenants,createTenant} = require("./services/tenant")
const {createUser} = require("./services/user");

app.get('/',(req,res)=>{
 return res.end("Welcome")
})

app.use("/user", connectionResolver.resolveTenant);
app.use("/admin", connectionResolver.setAdminDb);

app.get("/admin/tenant",(req,res)=>{
 return res.json(getConnection())
})
app.get("/admin/tenant/detail",(req,res)=>{
 return res.json(getAllTenants())
})
app.post("/admin/tenant",(req,res)=>{
 return res.json(createTenant(req.body));
})

app.get('/user/tenant',(req,res)=>{
 try{
  return res.json(getConnection());
 }
 catch(err){
  return res.status(500).json(err);
 } 
})

app.post('/user/tenant',(req,res)=>{
 const body = req.body;
 createUser(req.query.tenant,body)
 return res.json(getConnection());
})

app.listen(process.env.PORT,()=>{
 console.log(`APP LISTEN ON PORT ${process.env.PORT}`)
})

