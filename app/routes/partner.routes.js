module.exports = app => {
  const partners = require("../controllers/partner.controller.js");

  var routerPartner = require("express").Router();

  // Create a new
  routerPartner.post("/", partners.create);

  // Retrieve all
  routerPartner.get("/", partners.findAll);

  // Retrieve all active
  routerPartner.get("/active", partners.findAllActive);

  // Retrieve a single
  routerPartner.get("/:id", partners.findOne);

  // Update with id
  routerPartner.put("/:id", partners.update);

  // Delete with id
  routerPartner.delete("/:id", partners.delete);

  // Create new
  routerPartner.delete("/", partners.deleteAll);

  app.use("/api/partners", routerPartner);
};