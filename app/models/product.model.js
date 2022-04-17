module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      sku: String,
      name: String,
      description: String,
      barcode: String,
      listprice: Number,
      botprice: Number,
      cost: Number,
      min: Number,
      max: Number,
      isStock: Boolean,
      qoh: Number,
      image: String,
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCat"
      },
      taxin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tax"
      },
      taxout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tax"
      },
      brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
      },
      supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
      },
      qop:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"}
      ],
      active: Boolean
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Product = mongoose.model("products", schema);
  return Product;
};