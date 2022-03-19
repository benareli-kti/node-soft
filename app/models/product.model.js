module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      sku: String,
      name: String,
      description: String,
      listprice: Number,
      botprice: Number,
      cost: Number,
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCat"
      },
      brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
      },
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