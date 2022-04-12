module.exports = app => {
  const possessions = require("../controllers/possession.controller.js");

  var routerPossession = require("express").Router();

  // Create a new
  routerPossession.post("/", possessions.create);

  // Retrieve all
  routerPossession.get("/", possessions.findAll);

  // Retrieve a single
  //routerPossession.get("/:id", possessions.findOne);

  // Retrieve a all open
  routerPossession.get("/allopen", possessions.findByAllOpen);

  // Retrieve a user
  routerPossession.get("/user/:user", possessions.findByUser);

  // Retrieve a user open
  routerPossession.get("/openuser/:user", possessions.findByUserOpen);

  // Retrieve a user open
  routerPossession.get("/closeuser/:user", possessions.findByUserClose);

  // Update with id
  routerPossession.put("/:id", possessions.update);

  // Delete with id
  routerPossession.delete("/:id", possessions.delete);

  // Create new
  routerPossession.delete("/", possessions.deleteAll);

  app.use("/api/possessions", routerPossession);
};