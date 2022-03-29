module.exports = app => {
  const ids = require("../controllers/id.controller.js");

  var routerId = require("express").Router();

  // Retrieve all
  routerId.get("/", logs.findAll);

  // Update with id
  routerId.put("/:id", logs.update);

  app.use("/api/ids", routerId);
};