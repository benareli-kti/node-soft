module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      order_id: String,
      amount_total: Number,
      payment1: Number,
      pay1method: String,
      payment2: Number,
      pay2method: String,
      change: Number
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Payment = mongoose.model("payments", schema);
  return Payment;
};