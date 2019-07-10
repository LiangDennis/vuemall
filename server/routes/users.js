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

module.exports = router;
