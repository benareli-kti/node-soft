module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      message: String,
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCat"
      },
      brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
      },
      warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse"
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Log = mongoose.model("logs", schema);
  return Log;
};