const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
  origin: "http://192.53.112.254:8081"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next)=>{
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

const db = require("./app/models");
const Role = db.role;
const Warehouse = db.warehouses;
const ProductCat = db.productcats;
const Partner = db.partners;
const Product = db.products;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
  //res.json({ message: "Welcome to bezkoder application." });
  res.status(200).send("Welcome");
});

// routes
require("./app/routes/useruser.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/productcat.routes")(app);
require("./app/routes/brand.routes")(app);
require("./app/routes/warehouse.routes")(app);
require("./app/routes/partner.routes")(app);

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "manager"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'manager' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });

  Warehouse.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Warehouse({
        name: "Gudang Utama",
        short: "UTAMA",
        active: true
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'Gudang Utama' to warehouses collection");
      });
    }
  });

  Partner.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Partner({
        code: "TEMP",
        name: "Template",
        isCustomer: true,
        isSupplier: true,
        active: true
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'Template' to partner collection");
      });
    }
  });

  ProductCat.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      ProductsCare();
    }
  });
}

function ProductsCare() {
  var prodcat = new ProductCat({
        catid: "TEMP",
        description: "Template",
        active: true
      });
  prodcat.save(function(err){
    if (err) return console.error(err.stack)

    console.log("added 'Template' to product category collection");
    var prod = new Product({
        sku: "TEMP",
        name: "Template",
        description: "Template Product",
        listprice: 1,
        category: prodcat._id,
        active: true
      });

    prod.save(function(err){
        if(err) return console.error(err.stack)
        console.log("Product is added")
    });
  });
}