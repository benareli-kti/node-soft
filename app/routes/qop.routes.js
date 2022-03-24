module.exports = app => {
  const qops = require("../controllers/qop.controller.js");

  var routerQop = require("express").Router();

  // Create a new
  routerQop.post("/", qops.create);

  // Retrieve all
  routerQop.get("/", qops.findAll);

  // Retrieve a single
  routerQop.get("/id/:id", qops.findOne);
  
  // Update with id
  routerQop.get("/cu/", qops.createUpdate);

  app.use("/api/qops", routerQop);
};