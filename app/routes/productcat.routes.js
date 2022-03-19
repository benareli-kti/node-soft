module.exports = app => {
  const productcats = require("../controllers/productcat.controller.js");

  var routerProductCat = require("express").Router();

  // Create a new
  routerProductCat.post("/", productcats.create);

  // Retrieve all
  routerProductCat.get("/", productcats.findAll);

  // Retrieve all active
  routerProductCat.get("/active", productcats.findAllActive);

  // Retrieve a single
  routerProductCat.get("/:id", productcats.findOne);

  // Update with id
  routerProductCat.put("/:id", productcats.update);

  // Delete with id
  routerProductCat.delete("/:id", productcats.delete);

  // Create new
  routerProductCat.delete("/", productcats.deleteAll);

  app.use("/api/productcats", routerProductCat);
};