const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const baseurl = require("./app/config/url.config");
const cron = require('node-cron');
const app = express();

var corsOptions = {
  origin: `http://${baseurl.baseurl}:8081`
};

global.__basedir = __dirname;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next)=>{
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

const db = require("./app/models");
const Role = db.role;
const Setting = db.settings;
const Ids = db.ids;
const Log = db.logs;

const Warehouse = db.warehouses;
const ProductCat = db.productcats;
const Partner = db.partners;
const Product = db.products;
const Stockmove = db.stockmoves;
const Qof = db.qofs;
const Qop = db.qops;
const Coa = db.coas;
const Tax = db.taxs;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", cors(corsOptions), (req, res) => {
  res.status(200).send("Welcome");
});

// routes
require("./app/routes/file.routes")(app);

require("./app/routes/id.routes")(app);
require("./app/routes/setting.routes")(app);
require("./app/routes/log.routes")(app);
require("./app/routes/useruser.routes")(app);
require("./app/routes/userrole.routes")(app);
require("./app/routes/tax.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/productcat.routes")(app);
require("./app/routes/brand.routes")(app);
require("./app/routes/warehouse.routes")(app);
require("./app/routes/partner.routes")(app);
require("./app/routes/stockmove.routes")(app);
require("./app/routes/qof.routes")(app);
require("./app/routes/qop.routes")(app);
require("./app/routes/possession.routes")(app);
require("./app/routes/pos.routes")(app);
require("./app/routes/posdetail.routes")(app);
require("./app/routes/payment.routes")(app);

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

cron.schedule('00 17 * * *', function() {
  console.log('Running stock calculation');
  checkQof();
});

//AI FUCK
function checkQof() {
  const find1 = Qof.find()
    .then(res => {
      if(res){
        if(res[0].partner){
          withPartner(res[0].product, res[0].partner, res[0].warehouse);
        }else{
          withoutPartner(res[0].product, res[0].warehouse);
        }
      }else{console.log("No Data");}
    })
    .catch(error => console.error(error));
}

function withPartner(prod1, part1, wh1) {
  const find2 = Qop.find({product: prod1, partner: part1, warehouse: wh1}).then(res => {
    if(!res.length){
      var qop1 = {product: prod1, partner: part1, warehouse: wh1, qop: 0};
      Qop.create(qop1).then(res => {
        let qop1 = res._id;
        const prod2 = Product.findOneAndUpdate({_id:prod1}, {$push: {qop: res._id}}, { useFindAndModify: false })
          .then(res => {
            withPartnerCalc(qop1, prod1, part1, wh1);
          }).catch(error => console.error(error));
      })
      .catch(error => console.error(error));
      

    }else{withPartnerCalc(res[0]._id, prod1, part1, wh1)}
  }).catch(error => console.error(error));
}

function withPartnerCalc(qop2, prod2, part2, wh2) {
  const cursor = Qof.find({product:prod2,partner:part2,warehouse:wh2})
    .then(results => {
      let x = 0;
      for (let i = 0; i < results.length; i++){
        x = x + results[i].qof};

      const prod = Product.find({_id:prod2})
        .then(resultsP => {
          let y = resultsP[0].qoh
          const upProd = Product.updateOne({_id:prod2},{qoh: x+y})
            .then(resultsUp => {
              withPartnerEnd(x, qop2, prod2, part2, wh2);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}

function withPartnerEnd(x, qop3, prod3, part3, wh3) {
  const findQop = Qop.find({_id:qop3})
    .then(resultsQop1 => {
      let z = resultsQop1[0].qop
      const upProd = Qop.updateOne({_id:qop3},{qop: x+z})
        .then(resultsQop2 => {
          const delQof = Qof.deleteMany({product:prod3,partner:part3,warehouse:wh3})
            .then(resultsdelQof => {
              console.log(prod3+", "+part3+", "+wh3+" handled");
              checkQof();
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}

//Without Partner Start Here
function withoutPartner(proda, wha){
  const findA = Qop.find({product: proda, warehouse: wha}).then(res => {
    if(!res.length){
      var qopaa = {product: proda, warehouse: wha, qop: 0};
      Qop.create(qopaa).then(res => {
        let qopa = res._id;
        const prodA = Product.findOneAndUpdate({_id:proda}, {$push: {qop: res._id}}, { useFindAndModify: false })
          .then(res => {
            withoutPartnerCalc(qopa, proda, wha);
          }).catch(error => console.error(error));
      })
      .catch(error => console.error(error));
      

    }else{withoutPartnerCalc(res[0]._id, proda, wha)}
  }).catch(error => console.error(error));
}

function withoutPartnerCalc(qopb, prodb, whb) {
  const cursor = Qof.find({product:prodb, warehouse:whb, partner: { $exists : false }})
    .then(results => {
      let a = 0;
      for (let i = 0; i < results.length; i++){
        a = a + results[i].qof};

      const prod = Product.find({_id:prodb})
        .then(resultsP => {
          let b = resultsP[0].qoh
          const upProd = Product.updateOne({_id:prodb},{qoh: a+b})
            .then(resultsUp => {
              withoutPartnerEnd(a, qopb, prodb, whb);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}

function withoutPartnerEnd(a, qopc, prodc, whc) {
  const findQop = Qop.find({_id:qopc})
    .then(resultsQop1 => {
      let d = resultsQop1[0].qop
      const upProd = Qop.updateOne({_id:qopc},{qop: a+d})
        .then(resultsQop2 => {
          const delQof = Qof.deleteMany({product:prodc, warehouse:whc, partner: { $exists : false }})
            .then(resultsdelQof => {
              console.log(prodc+", "+whc+" handled");
              checkQof();
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}
//AI SHIT

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({name: "inventory_user"})
      .save(err => {if (err) {console.log("error", err);}
        console.log("added 'inventory_user' to roles collection");
      });
      new Role({name: "inventory_manager"})
      .save(err => {if (err) {console.log("error", err);}
        console.log("added 'inventory_user' to roles collection");
      });
      new Role({name: "partner_user"})
      .save(err => {if (err) {console.log("error", err);}
        console.log("added 'inventory_user' to roles collection");
      });
      new Role({name: "partner_manager"})
      .save(err => {if (err) {console.log("error", err);}
        console.log("added 'inventory_user' to roles collection");
      });
      new Role({name: "trans_user"})
      .save(err => {if (err) {console.log("error", err);}
        console.log("added 'inventory_user' to roles collection");
      });
      new Role({name: "trans_manager"})
      .save(err => {if (err) {console.log("error", err);}
        console.log("added 'inventory_user' to roles collection");
      });
      new Role({name: "admin"})
      .save(err => {if (err) {console.log("error", err);}
        console.log("added 'admin' to roles collection");
      });
      
      var ids = new Ids({
        pos_id: 1,
        pos_session: 1,
        transfer_id: 1
      });
      ids.save(function(err){
        if (err) return console.error(err.stack)
        console.log("added 'Ids' to ID collection");
      });

      var settings = new Setting({
        comp_name: "Soft Solution",
        comp_addr: "",
        comp_phone: "",
        comp_email: "",
        pos_shift: false
      });
      settings.save(function(err){
        if (err) return console.error(err.stack)
        console.log("added Setting collection");
      });
    }
  });

  Coa.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      CoaCare();
    }
  });

  Warehouse.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      WarehouseCare();
    }
  });

  Partner.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      PartnerCare();
    }
  });

  ProductCat.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      ProductsCare();
    }
  });
}

function CoaCare() {
  var c11001 = new Coa({prefix: 1,code: "1-1001",name: "Kas",active: true});
  c11001.save(function(err){if (err) return console.error(err.stack)});
  var c11101 = new Coa({prefix: 1,code: "1-1101",name: "Bank",active: true});
  c11101.save(function(err){if (err) return console.error(err.stack)});
  var c11111 = new Coa({prefix: 1,code: "1-1111",name: "Settlement",active: true});
  c11111.save(function(err){if (err) return console.error(err.stack)});
  var c12001 = new Coa({prefix: 1,code: "1-2001",name: "Piutang",active: true});
  c12001.save(function(err){if (err) return console.error(err.stack)});
  var c13001 = new Coa({prefix: 1,code: "1-3001",name: "PPN Masukan",active: true});
  c13001.save(function(err){if (err) return console.error(err.stack)});
  var c15001 = new Coa({prefix: 1,code: "1-5001",name: "Aktiva Tetap",active: true});
  c15001.save(function(err){if (err) return console.error(err.stack)});
  var c21001 = new Coa({prefix: 2,code: "2-1001",name: "Hutang Dagang",active: true});
  c21001.save(function(err){if (err) return console.error(err.stack)});
  var c22001 = new Coa({prefix: 2,code: "2-1001",name: "Hutang Lainnya",active: true});
  c22001.save(function(err){if (err) return console.error(err.stack)});
  var c23001 = new Coa({prefix: 2,code: "2-3001",name: "PPN Keluaran",active: true});
  c23001.save(function(err){if (err) return console.error(err.stack)});
  var c31001 = new Coa({prefix: 3,code: "3-1001",name: "Modal",active: true});
  c31001.save(function(err){if (err) return console.error(err.stack)});
  var c34001 = new Coa({prefix: 3,code: "3-4001",name: "Laba Rugi",active: true});
  c34001.save(function(err){if (err) return console.error(err.stack)});
  var c41001 = new Coa({prefix: 4,code: "4-1001",name: "Pendapatan",active: true});
  c41001.save(function(err){if (err) return console.error(err.stack)});
  var c51001 = new Coa({prefix: 5,code: "5-1001",name: "HPP",active: true});
  c51001.save(function(err){if (err) return console.error(err.stack)});
  var c61001 = new Coa({prefix: 6,code: "6-1001",name: "Biaya Operasional",active: true});
  c61001.save(function(err){if (err) return console.error(err.stack)});
  var c62001 = new Coa({prefix: 6,code: "6-1001",name: "Biaya Variabel",active: true});
  c62001.save(function(err){if (err) return console.error(err.stack)});
  var c69001 = new Coa({prefix: 6,code: "6-9001",name: "Biaya Lain Lain",active: true});
  c69001.save(function(err){if (err) return console.error(err.stack)});
  console.log("COA is added");
}

function WarehouseCare() {
  var warehouse = new Warehouse({
        name: "Gudang Utama",
        short: "UTAMA",
        main: true,
        active: true
      });
  warehouse.save(function(err){
    if (err) return console.error(err.stack)
    console.log("added 'Gudang Utama' to warehouse collection");
    var logWH = new Log({
        message: "added by system",
        warehouse: warehouse._id
    });
    logWH.save(function(err){
        if(err) return console.error(err.stack)
        console.log("Log is added");
    });
  });
}

function PartnerCare() {
  var partner = new Partner({
        code: "TEMP",
        name: "Template",
        isCustomer: true,
        isSupplier: true,
        active: true
      });
  partner.save(function(err){
    if (err) return console.error(err.stack)
    console.log("added 'Partner' to partner collection");
    var logPT = new Log({
        message: "added by system",
        partner: partner._id
    });
    logPT.save(function(err){
        if(err) return console.error(err.stack)
        console.log("Log is added");
    });
  });
}

function ProductsCare() {
  var tax = new Tax({
        tax: 11,
        name: "PPN 11%"
      });
  tax.save(function(err){
    if (err) return console.error(err.stack)
    console.log("added 'PPN' to tax collection");
    var prodcat = new ProductCat({
        catid: "TEMP",
        description: "Template",
        active: true
      });
    prodcat.save(function(err){
      if (err) return console.error(err.stack)
      console.log("added 'Template' to product category collection");
      var logPC = new Log({
        message: "added by system",
        category: prodcat._id
      });
      logPC.save(function(err){
        if(err) return console.error(err.stack)
        console.log("Log is added");
        var prod = new Product({
          sku: "TEMP",
          name: "Template",
          description: "Template Product",
          listprice: 1,
          qoh: 0,
          isStock: true,
          image: "default.png",
          category: prodcat._id,
          taxin: tax._id,
          taxout: tax._id,
          active: true
        });
        prod.save(function(err){
          if(err) return console.error(err.stack)
          console.log("Product is added");
          var logPR = new Log({
            message: "added by system",
            product: prod._id
          });
          logPR.save(function(err){
            if(err) return console.error(err.stack)
            console.log("Log is added")
          });
        });
      });
    });
  });
  
}