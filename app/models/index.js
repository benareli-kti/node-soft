const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.logs = require("./log.model.js")(mongoose);
db.products = require("./product.model.js")(mongoose);
db.productcats = require("./productcat.model.js")(mongoose);
db.brands = require("./brand.model.js")(mongoose);
db.warehouses = require("./warehouse.model.js")(mongoose);
db.partners = require("./partner.model.js")(mongoose);
db.stockmoves = require("./stockmove.model.js")(mongoose);
db.qofs = require("./qof.model.js")(mongoose);
db.qops = require("./qop.model.js")(mongoose);

db.users = require("./useruser.model.js")(mongoose);
db.user = require("./user.model");
db.role = require("./role.model");

db.ROLES = ["user", "admin", "manager"];

module.exports = db;