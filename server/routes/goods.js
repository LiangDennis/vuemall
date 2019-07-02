
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
    // 实现排序，分页，原生的node使用req.url获取字段，通过express封装可以通过param获取字段
    // let page = parseInt(req.param("page"));
    // let pageSize = parseInt(req.param("pageSize"));
    // let sort = req.param("sort");
    // let skip = (page - 1) * pageSize;
    // // 返回的是文档，res.json输出是一个json，res.end输出是一个文本
    // // mongodb提供了分页和条数的方法，skip和limit
    // let params = {};
    // let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    // goodsModel.sort({"salePrice":sort});
    // goodsModel.exec((err, doc) => {

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
// 执行排序
router.get("/sort",(req,res,next) => {
    // 实现排序，分页，原生的node使用req.url获取字段，通过express封装可以通过param获取字段
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let sort = req.param("sort");
    // console.log(sort);
    let skip = (page - 1) * pageSize;
    // 价格过滤
    let priceLevel = req.param("priceLevel");
    // 返回的是文档，res.json输出是一个json，res.end输出是一个文本
    // mongodb提供了分页和条数的方法，skip和limit
    let params = {};
    // 价格过滤
    var priceGt = "",priceLte = "";
    if(priceLevel != "all") {
        switch(priceLevel) {
            case "0" : priceGt = 0;priceLte = 100;break;
            case "1" : priceGt = 100;priceLte = 500;break;
            case "2" : priceGt = 500;priceLte = 1000;break;
            case "3" : priceGt = 1000;priceLte = 5000;break;
        }
        console.log(priceGt+"  "+priceLte);
        // 如果包含了就要加上这个变量
        params = {
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({"salePrice":sort});
    goodsModel.exec((err, doc) => {

    // Goods.find({},(err, doc) => {
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