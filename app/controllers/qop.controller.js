const db = require("../models");
const Qop = db.qops;
const Product = db.products;
const Partner = db.partners;
const Warehouse = db.warehouses;
const mongoose = require("mongoose");

// Create and Save new
exports.create = (req, res) => {

  // Create
  const qop = new Qop({
    product: mongoose.Types.ObjectId(req.body.product),
    partner: mongoose.Types.ObjectId(req.body.partner),
    warehouse: mongoose.Types.ObjectId(req.body.warehouse),
    qop: req.body.qop
  });

  // Save in the database
  qop
    .save(qop)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message
      });
    });
};

// Create and Update Product new
exports.createUpdate = (req, res) => {

  // Find first
  if(req.query.partner != "null"){
    Qop.find({product: req.query.product, partner: req.query.partner, warehouse: req.query.warehouse})
      .then(data => {
        if(!data.length){
          const qop = ({product: mongoose.Types.ObjectId(req.query.product),partner: mongoose.Types.ObjectId(req.query.partner),
            warehouse: mongoose.Types.ObjectId(req.query.warehouse), qop: 0});
          Qop.create(qop).then(dataa => {
            let qopid = dataa[0]._id;
            const prod1 = Product.findOneAndUpdate({_id:req.query.product}, {$push: {qop: res._id}}, { new: true })
              .then(datab => {
                const prod2 = Product.find({_id:req.query.product})
                  .then(datac => {
                    let x = datac[0].qoh;
                    const prod3 = Product.findOneAndUpdate({_id:req.query.product},{qoh:x+req.query.qop})
                      .then(datad => {
                        const qop2 = Qop.update({_id:qopid},{qop:req.query.qop})
                          .then(datae => {
                            res.send(datae);
                          }).catch(err =>{res.status(500).send({message:err.message || '05'});});
                      }).catch(err =>{res.status(500).send({message:err.message || '04'}); });
                  }).catch(err =>{res.status(500).send({message:err.message || '03'}); });
              }).catch(err =>{res.status(500).send({message:err.message || '02'}); });
          }).catch(err =>{res.status(500).send({message:err.message || '01''}); });
        }else{
          let qopid = data[0]._id;
          let qopqop = data[0].qop;
          Qop.update({_id:qopid},{qop: qop+req.query.qop})
            .then(dataa => {
              const prod1 = Product.find({_id:req.query.product})
                .then(datab => {
                  let x = datab[0].qoh;
                  const prod2 = Product.findOneAndUpdate({_id:req.query.product},{qoh:x+req.query.qop})
                    .then(datac => {
                      res.send(datac);
                    }).catch(err =>{res.status(500).send({message:err.message}); });
                }).catch(err =>{res.status(500).send({message:err.message}); });
            }).catch(err =>{res.status(500).send({message:err.message}); });
        }
        
      })
      .catch(err => {
        res.status(500).send({
        message:err.message
        });
      });
  }else{
    Qop.find({product: req.query.product, partner: { $exists : false }, warehouse: req.query.warehouse})
      .then(data => {
        if(!data.length){
          const qop = ({product: mongoose.Types.ObjectId(req.query.product),warehouse: mongoose.Types.ObjectId(req.query.warehouse), qop: 0});
          Qop.create(qop).then(dataa => {
            let qopid = dataa[0]._id;
            const prod1 = Product.findOneAndUpdate({_id:req.query.product}, {$push: {qop: res._id}}, { new: true })
              .then(datab => {
                const prod2 = Product.find({_id:req.query.product})
                  .then(datac => {
                    let x = datac[0].qoh;
                    const prod3 = Product.findOneAndUpdate({_id:req.query.product},{qoh:x+req.query.qop})
                      .then(datad => {
                        const qop2 = Qop.update({_id:qopid},{qop:req.query.qop})
                          .then(datae => {
                            res.send(datae);
                          }).catch(err =>{res.status(500).send({message:err.message}); });
                      }).catch(err =>{res.status(500).send({message:err.message}); });
                  }).catch(err =>{res.status(500).send({message:err.message}); });
              }).catch(err =>{res.status(500).send({message:err.message}); });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }else{
          let qopid = data[0]._id;
          let qopqop = data[0].qop;
          Qop.update({_id:qopid},{qop: qop+req.query.qop})
            .then(dataa => {
              const prod1 = Product.find({_id:req.query.product})
                .then(datab => {
                  let x = datab[0].qoh;
                  const prod2 = Product.findOneAndUpdate({_id:req.query.product},{qoh:x+req.query.qop})
                    .then(datac => {
                      res.send(datac);
                    }).catch(err =>{res.status(500).send({message:err.message}); });
                }).catch(err =>{res.status(500).send({message:err.message}); });
            }).catch(err =>{res.status(500).send({message:err.message}); });
        }
        
      })
      .catch(err => {
        res.status(500).send({
        message:err.message
        });
      });
  }
};


// Retrieve all from the database.
exports.findAll = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  var o_id = mongoose.Types.ObjectId(req.query.product);

  Qop.find({product: o_id})
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

  Qop.findById(id)
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
exports.findByProduct = (req, res) => {

  Qop.find({product: req.query.product})
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

// Update by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Qop.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else res.send({ message: "Updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating with id=" + id
      });
    });
};
