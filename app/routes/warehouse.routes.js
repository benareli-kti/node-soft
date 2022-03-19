module.exports = app => {
  const warehouses = require("../controllers/warehouse.controller.js");

  var routerWh = require("express").Router();

  // Create a new
  routerWh.post("/", warehouses.create);

  // Retrieve all
  routerWh.get("/", warehouses.findAll);

  // Retrieve all active
  routerWh.get("/active", warehouses.findAllActive);

  // Retrieve a single
  routerWh.get("/:id", warehouses.findOne);

  // Update with id
  routerWh.put("/:id", warehouses.update);

  // Delete with id
  routerWh.delete("/:id", warehouses.delete);

  // Create new
  routerWh.delete("/", warehouses.deleteAll);

  app.use("/api/warehouses", routerWh);
};