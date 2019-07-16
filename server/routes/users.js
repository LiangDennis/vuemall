var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

//登录，其他为默认
var User = require('./../modules/users');
router.post('/login', (req, res, next) => {
  let param = {
    userName : req.body.userName,
    userPwd : req.body.userPwd
  };

  User.findOne(param, (err, doc) => {
    if(err) {
      res.json({
        status:"1",
        msg:err.message
      });
    }else {
      if(doc) {
          //cookie,参数，cookie名称，值，地址，
          //cookie可以伪造
          res.cookie("userId", doc.userId, {
            path:'/',//存到根目录
            maxAge:1000*60*60
          });
          res.cookie("userName", doc.userName, {
            path:'/',//存到根目录
            maxAge:1000*60*60
          });
          res.json({
            status:'0',
            msg:'',
            result:{
              userName:doc.userName
            }
          });
      }else {
        // 如果没有查到用户，即用户为空
        res.json({
          status:"1",
          msg:"没有该用户"
        });
      }
    }
  });
});

// 登出接口
router.post("/logout", (req, res, next) => {
  res.cookie("userId","", {
    path:"/",
    maxAge:-1
  });
  res.cookie("userName","", {
    path:"/",
    maxAge:-1
  });
  res.json({
    status:"0",
    msg:'',
    result:"suc"
  });
});

// 校验登录，在加载组件时，即mounted时就需要校验
router.get("/checkLogin", (req, res, next) => {
  if(req.cookies.userId) {
    res.json({
      status:"0",
      msg:"",
      result:req.cookies.userName
    });
  }else {
    res.json({
      status:"1",
      msg:"未登录",
      result:""
    });
  }
});

//查询当前用户的购物车数据
router.get("/cartList", (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({userId:userId}, (err, doc) => {
    if(err) {
      res.json({
        status:"1",
        msg:err.message,
        result:""
      });
    }else {
      if(doc) {
      res.json({
        status:"0",
        msg:"",
        result:doc.cartList
        });
      }
    }
  });
});

// 购物车删除
router.post("/cartDel",(req,res,next) => {
  console.log("删除购物车数据");
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  User.update({
      userId:userId
    },{
      // 删除的方式
      $pull: {
        "cartList":{
          "productId":productId
        }
      }
    },(err, doc) => {
      if(err) {
        res.json({
          status:"1",
          msg:err.message,
          result:""
        });
      }else {
        res.json({
          status:"0",
          msg:"",
          result:"suc"
        });
      }
    }
  );
});

// 修改商品数量
router.post("/cartEdit",(req,res,next) => {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  let productNum = req.body.productNum;
  let checked = req.body.checked;

  /*
  * 更新的条件，以此知道更新的是哪一条数据
  * 第二个对象是需要修改成什么样。$是占位符，
  * 第三个是回调的方法。
  */
  User.update({
    userId:userId,
    "cartList.productId":productId
  },{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  }, (err,doc)=> {
    if(err) {
      res.json({
        status:"1",
        msg:err.message,
        result:""
      });
    }else {
      res.json({
        status:"0",
        msg:"",
        result:"suc"
      });
    }
  });
});

// 选中所有商品
router.post("/editCheckAll", (req, res, next) => {
  let userId = req.cookies.userId;
  let checkAll = req.body.checkAll?"1":"0";
  User.findOne({userId:userId}, (err, user) => {
    if(err) {
      res.json({
        status:"1",
        msg:err.message,
        result:""
      });
    }else {
      if(user) {
        user.cartList.forEach(item => {
          item.checked = checkAll;
        });
        user.save((err1, doc)=> {
          if(err1) {
            res.json({
              status:"1",
              msg:err1.message,
              result:""
            });
          }else {
            res.json({
              status:"0",
              msg:"",
              result:"suc"
            });
          }
        });
      }
    }
  });
});

// 地址列表
router.get("/addressList", (req,res,next) => {
  let userId = req.cookies.userId;
  User.findOne({userId:userId}, (err,doc) => {
    if(err) {
      res.json({
        status:"1",
        msg:err.message,
        result:""
      });
    }else {
      res.json({
        status:"0",
        msg:"",
        result:doc.addressList
      });
    }
  });
});

// 设置默认地址
router.post("/setDefault",(req,res,next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  // 判断addressId是否存在
  if(!addressId) {
    res.json({
      status:"1003",
      msg:"AddressId is null",
      result:""
    });
  }else {
    User.findOne({userId:userId}, (err,doc) => {
      if(err) {
        res.json({
          status:"1",
          msg:err.message,
          result:""
        });
      }else {
        let addressList = doc.addressList;
        // 只允许一个默认地址。
        addressList.forEach((item) => {
          if(item.addressId == addressId) {
            item.isDefault = true;
          }else {
            item.isDefault = false;
          }
        });

        doc.save((err1,doc1) => {
          if(err1) {
            res.json({
              status:"1",
              msg:err1.message,
              result:""
            });
          }else {
            res.json({
              status:"0",
              msg:"",
              result:""
            });
          }
        });
      }
    });
  }
});
module.exports = router;
