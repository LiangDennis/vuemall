
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var productSchema = new Schema({
    "productId":{type:String},
    "productName":String,
    "setPrice":Number,
    "productImage":String,
});

module.exports = mongoose.model("Good",productSchema);