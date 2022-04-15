const db = require("../models");
const Product = db.products;
const ProductCat = db.productcats;
const Brand = db.brands;
const Partner = db.partners;
const Log = db.logs;
const User = db.users;
const Tax = db.taxs;
const mongoose = require("mongoose");
const duplicate = [];
const skipped = [];
var Pcateg = '';
var Pbrand = '';
var Ptaxin = '100';
var Ptaxout = '100';

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if(req.body.taxin==""){
    const product = ({
      sku: req.body.sku,
      name: req.body.name,
      description: req.body.description,
      barcode: req.body.barcode,
      listprice: req.body.listprice,
      botprice: req.body.botprice,
      cost: req.body.cost,
      qoh: req.body.qoh,
      image: req.body.image,
      isStock: req.body.isStock ? req.body.isStock : false,
      category: req.body.category,
      taxout: req.body.taxout,
      brand: req.body.brand,
      active: req.body.active ? req.body.active : false
    });
    Product.create(product).then(dataa => {
      const log = ({message: "add", product: dataa._id, user: req.body.user,});
      Log.create(log).then(datab => {
        res.send(datab);
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }else if(req.body.taxout==""){
    const product = ({
      sku: req.body.sku,
      name: req.body.name,
      description: req.body.description,
      barcode: req.body.barcode,
      listprice: req.body.listprice,
      botprice: req.body.botprice,
      cost: req.body.cost,
      qoh: req.body.qoh,
      image: req.body.image,
      isStock: req.body.isStock ? req.body.isStock : false,
      category: req.body.category,
      taxin: req.body.taxin,
      brand: req.body.brand,
      active: req.body.active ? req.body.active : false
    });
    Product.create(product).then(dataa => {
      const log = ({message: "add", product: dataa._id, user: req.body.user,});
      Log.create(log).then(datab => {
        res.send(datab);
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }else if(req.body.taxout=="" && req.body.taxin==""){
    const product = ({
      sku: req.body.sku,
      name: req.body.name,
      description: req.body.description,
      barcode: req.body.barcode,
      listprice: req.body.listprice,
      botprice: req.body.botprice,
      cost: req.body.cost,
      qoh: req.body.qoh,
      image: req.body.image,
      isStock: req.body.isStock ? req.body.isStock : false,
      category: req.body.category,
      brand: req.body.brand,
      active: req.body.active ? req.body.active : false
    });
    Product.create(product).then(dataa => {
      const log = ({message: "add", product: dataa._id, user: req.body.user,});
      Log.create(log).then(datab => {
        res.send(datab);
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }else{
    const product = ({
      sku: req.body.sku,
      name: req.body.name,
      description: req.body.description,
      barcode: req.body.barcode,
      listprice: req.body.listprice,
      botprice: req.body.botprice,
      cost: req.body.cost,
      qoh: req.body.qoh,
      image: req.body.image,
      isStock: req.body.isStock ? req.body.isStock : false,
      category: req.body.category,
      taxin: req.body.taxin,
      taxout: req.body.taxout,
      brand: req.body.brand,
      active: req.body.active ? req.body.active : false
    });
    Product.create(product).then(dataa => {
      const log = ({message: "add", product: dataa._id, user: req.body.user,});
      Log.create(log).then(datab => {
        res.send(datab);
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};


// Create and Save new
exports.createMany = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }else{startSequence(0, req.body, req.query.user, res);}
};

function startSequence(x, reqs, users, res){
  if(reqs[x]){
    Product.find({name: reqs[x].name}).then(data => {
      if(data.length>0){
        duplicate.push(x+1);
        sequencing(x, reqs, users, res);
      }
      else{
        ProductCat.find({description: reqs[x].category}).then(dataa => {
          if(dataa.length>0) Pcateg = dataa[0]._id;
          else{ skip.push(x+1); sequencing(x, reqs, users, res); }
          Brand.find({description: reqs[x].brand}).then(datab => {
            if(datab.length>0) Pbrand = datab[0]._id;
            if(!reqs[x].tax_in) reqs[x].tax_in = '0';
            Tax.find({tax: Number(reqs[x].tax_in)}).then(datac => {
              if(datac) Ptaxin = datac[0]._id;
              Tax.find({tax: Number(reqs[x].tax_out)}).then(datad => {
                if(datad) Ptaxout = datad[0]._id;
                
                if(reqs[x].type=='barang'||reqs[x].type=='Barang'||reqs[x].type=="BARANG"){
                  const product = ({
                    sku:reqs[x].sku,name:reqs[x].name,description:reqs[x].description,
                    barcode:reqs[x].barcode,listprice:reqs[x].listprice,qoh:0,
                    botprice:reqs[x].botprice,cost:reqs[x].cost,image:"default.png",
                    isStock:true,category:Pcateg,taxin:Ptaxin,taxout:Ptaxout,
                    brand:Pbrand,active:true
                  })
                  Product.create(product).then(datae => {
                  const log = ({message: "add", product: datae._id, user: users,});
                    Log.create(log).then(dataf => {
                      sequencing(x, reqs, users, res);
                    }).catch(err =>{res.status(500).send({message:err.message}); });
                  }).catch(err =>{res.status(500).send({message:err.message}); });
                }else{
                  const product = ({
                    sku:reqs[x].sku,name:reqs[x].name,description:reqs[x].description,
                    barcode:reqs[x].barcode,listprice:reqs[x].listprice,qoh:0,
                    botprice:reqs[x].botprice,cost:reqs[x].cost,image:"default.png",
                    isStock:false,category:Pcateg,taxin:Ptaxin,taxout:Ptaxout,
                    brand:Pbrand,active:true
                  })
                  Product.create(product).then(datae => {
                  const log = ({message: "add", product: datae._id, user: users,});
                    Log.create(log).then(dataf => {
                      sequencing(x, reqs, users, res);
                    }).catch(err =>{res.status(500).send({message:err.message}); });
                  }).catch(err =>{res.status(500).send({message:err.message}); });
                }

              }).catch(err =>{res.status(500).send({message:err.message}); });
            }).catch(err =>{res.status(500).send({message:err.message}); });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
        
      }
    });
  }else{
    if(duplicate.length>0||skipped.length>0) res.status(500).send(duplicate, skipped);
    else res.status(200).send({message:"All Data had been inputed!"});
  }
}

function sequencing(x, reqs, users, res){
  x=x+1;
  startSequence(x, reqs, users, res);
}

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  Product.find(condition)
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
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

  Product.findById(id)
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
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
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  Product.find(condition)
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
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
  if (req.body.taxin==""){
    Product.findByIdAndUpdate(id, {$unset: {taxin:1}}, { useFindAndModify: false })
    .then(data => {});
    Product.findByIdAndUpdate(id, {
      sku: req.body.sku,
        name: req.body.name,
        description: req.body.description,
        listprice: req.body.listprice,
        botprice: req.body.botprice,
        cost: req.body.cost,
        image: req.body.image,
        isStock: req.body.isStock ? req.body.isStock : false,
        category: req.body.category,
        taxout: req.body.taxout,
        brand: req.body.brand,
        active: req.body.active ? req.body.active : false
        },{ useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
          });
        } else {
          const log = ({message: req.body.message, product: req.params.id, user: req.body.user,});
          Log.create(log).then(datab => {
            res.send({ message: "Updated successfully." });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating with id=" + id
        });
    });
  }else if (req.body.taxout==""){
    Product.findByIdAndUpdate(id, {$unset: {taxout:1}}, { useFindAndModify: false })
    .then(data => {});
    Product.findByIdAndUpdate(id, {
      sku: req.body.sku,
        name: req.body.name,
        description: req.body.description,
        listprice: req.body.listprice,
        botprice: req.body.botprice,
        cost: req.body.cost,
        image: req.body.image,
        isStock: req.body.isStock ? req.body.isStock : false,
        category: req.body.category,
        taxin: req.body.taxin,
        brand: req.body.brand,
        active: req.body.active ? req.body.active : false
        },{ useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
          });
        } else {
          const log = ({message: req.body.message, product: req.params.id, user: req.body.user,});
          Log.create(log).then(datab => {
            res.send({ message: "Updated successfully." });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating with id=" + id
        });
    });
  }else if (req.body.taxout=="" && req.body.taxin==""){
    Product.findByIdAndUpdate(id, {$unset: {taxout:1,taxin:1}}, { useFindAndModify: false })
    .then(data => {});
    Product.findByIdAndUpdate(id, {
      sku: req.body.sku,
        name: req.body.name,
        description: req.body.description,
        listprice: req.body.listprice,
        botprice: req.body.botprice,
        cost: req.body.cost,
        image: req.body.image,
        isStock: req.body.isStock ? req.body.isStock : false,
        category: req.body.category,
        brand: req.body.brand,
        active: req.body.active ? req.body.active : false
        },{ useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
          });
        } else {
          const log = ({message: req.body.message, product: req.params.id, user: req.body.user,});
          Log.create(log).then(datab => {
            res.send({ message: "Updated successfully." });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating with id=" + id
        });
    });
  }else{

    Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: req.body.message, product: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating with id=" + id
      });
    });
  }
};

// Delete with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Product.findByIdAndRemove(id, { useFindAndModify: false })
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
  Product.deleteMany({})
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

// Find all active
exports.findAllActive = (req, res) => {
  Product.find({ active: true })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'taxin', model: Tax })
    .populate({ path: 'taxout', model: Tax })
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

//Find all stock
exports.findAllStock = (req, res) => {
  Product.find({ isStock: true })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
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

//Find all active stock
exports.findAllActiveStock = (req, res) => {
  Product.find({ active: true, isStock: true })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
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