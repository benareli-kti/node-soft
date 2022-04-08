const db = require("../models");
const Pos = db.poss;
const Posdetail = db.posdetails;
const Qof = db.qofs;
const mongoose = require("mongoose");

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if (!req.body.order_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  if(req.body.isStock=="true"){
    const posdetail = ({
      order_id: req.body.order_id,
      qty: req.body.qty,
      price_unit: req.body.price_unit,
      subtotal: req.body.subtotal,
      product: req.body.product,
      warehouse: req.body.warehouse
    });
    Posdetail.create(posdetail).then(dataa => { 
      const pos1 = Pos.findOneAndUpdate({_id:req.body.ids}, {$push: {pos_detail: dataa._id}}, { new: true })
        .then(datab => { 
          const qof1 = ({qof: 0-Number(req.body.qty), product: req.body.product, warehouse: req.body.warehouse});
            Qof.create(qof1).then(datac => {
              res.send(datac);
            });
        });
    });
  }else if(req.body.isStock=="false"){
    const posdetail = ({
      order_id: req.body.order_id,
      qty: req.body.qty,
      price_unit: req.body.price_unit,
      subtotal: req.body.subtotal,
      product: req.body.product,
      warehouse: req.body.warehouse
    });
    Posdetail.create(posdetail).then(dataa => { 
      const pos1 = Pos.findOneAndUpdate({_id:req.body.ids}, {$push: {pos_detail: dataa._id}}, { new: true })
        .then(datab => { 
          res.send(datab);
        });
    });
  }
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const order_id = req.query.order_id;
  var condition = order_id ? { order_id: { $regex: new RegExp(order_id), $options: "i" } } : {};

  Posdetail.find(condition)
    .populate({ path: 'product', model: Product })
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

  Posdetail.findById(id)
    .populate({ path: 'product', model: Product })
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
  const order_id = req.query.order_id;
  var condition = order_id ? { order_id: { $regex: new RegExp(order_id), $options: "i" } } : {};

  Posdetail.find(condition)
    .populate({ path: 'product', model: Product })
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

// Update by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Posdetail.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating with id=" + id
      });
    });
};

// Delete with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Posdetail.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({
          message: "Deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete with id=" + id
      });
    });
};

// Delete all from the database.
exports.deleteAll = (req, res) => {
  Posdetail.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Data were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all data."
      });
    });
};