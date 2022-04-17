module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      qin: Number,
      qout: Number,
      cost: Number,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
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
      }
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Stockmove = mongoose.model("stockmoves", schema);
  return Stockmove;
};