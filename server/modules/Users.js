/**
 * 引入mongoose
 * 根据数据表创建模型
 * 定义为Array的暂时不使用，使用默认array的数据类型
 * 
 * 在router里面加入，并定义api
 */

var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    "userId":String,
    "userName":String,
    "userPwd":String,
    "orderList":Array,
    "cartList":[
        {
            "productId":String,
            "productName":String,
            "salePrice":String,
            "productImage":String,
            "checked":String,
            "productNum":String
        }
    ],
    "addressList":Array
});

module.exports = mongoose.model("User",userSchema);