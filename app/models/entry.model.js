module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      debit_acc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coa"
      },
      credit_acc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coa"
      },
      debit: Number,
      credit: Number
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Entry = mongoose.model("entrys", schema);
  return Entry;
};