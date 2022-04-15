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
      isStock: Boolean,
      qoh: Number,
      image: String,
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCat",
        description: String
      },
      taxin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tax",
        name: String
      },
      taxout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tax",
        name: String
      },
      brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        description: String
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