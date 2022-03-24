const db = require("../models");
const Stockmove = db.stockmoves;
const Product = db.products;
const Partner = db.partners;
const Warehouse = db.warehouses;
const User = db.users;
const mongoose = require("mongoose");

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  /*if (!req.body.product) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }*/

  // Create
  if(req.body.partner != "null"){
    const stockmove = new Stockmove({
      user: mongoose.Types.ObjectId(req.body.user),
      product: mongoose.Types.ObjectId(req.body.product),
      partner: mongoose.Types.ObjectId(req.body.partner),
      warehouse: mongoose.Types.ObjectId(req.body.warehouse),
      qin: req.body.qin,
      qout: req.body.qout
    });
    stockmove.save(stockmove).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  if(req.body.partner == "null"){
    const stockmove = new Stockmove({
      user: mongoose.Types.ObjectId(req.body.user),
      product: mongoose.Types.ObjectId(req.body.product),
      warehouse: mongoose.Types.ObjectId(req.body.warehouse),
      qin: req.body.qin,
      qout: req.body.qout
    });
    stockmove.save(stockmove).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};

  Stockmove.find(condition)
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    });
};

// Find a single with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Stockmove.findById(id)
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Data with id=" + id });
    });
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};

  Stockmove.find(condition)
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    });
};