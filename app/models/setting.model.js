module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      comp_name: String,
      comp_addr: String,
      comp_phone: String,
      comp_email: String,
      pos_shift: Boolean
    }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Setting = mongoose.model("settings", schema);
  return Setting;
};