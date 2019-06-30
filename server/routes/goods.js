
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Goods = require("../modules/Goods");

// 连接数据库
mongoose.connect("mongodb://root:123456@127.0.0.1:27017/mall");
// 监听数据库是否连接成功
mongoose.connection.on("connected",() => {
    console.log("MongoDB connected successs");
});
mongoose.connection.on("error",() => {
    console.log("MongoDB connected fail");
});
mongoose.connection.on("disconnected",() => {
    console.log("MongoDB connected disconnected");
});

router.get("/",(req,res,next) => {
    // 返回的是文档，res.json输出是一个json，res.end输出是一个文本
    Goods.find({},(err, doc) => {
        if(err) {
            res.json({
                "status":1,
                msg:err.message
            });
        }else {
            res.json({
                "status":0,
                msg:"",
                result:{
                    count:doc.length,
                    list:doc
                }
            });
        }
    });
});

// mongoose.disconnect("mongodb://127.0.0.1:27017/mall");
module.exports = router;