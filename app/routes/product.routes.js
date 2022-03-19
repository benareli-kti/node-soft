module.exports = app => {
  const products = require("../controllers/product.controller.js");

  var routerProduct = require("express").Router();

  // Create a new
  routerProduct.post("/", products.create);

  // Retrieve all
  routerProduct.get("/", products.findAll);

  // Retrieve all active
  routerProduct.get("/active", products.findAllActive);

  // Retrieve a single
  routerProduct.get("/:id", products.findOne);

  // Update with id
  routerProduct.put("/:id", products.update);

  // Delete with id
  routerProduct.delete("/:id", products.delete);

  // Create new
  routerProduct.delete("/", products.deleteAll);

  app.use("/api/products", routerProduct);
};