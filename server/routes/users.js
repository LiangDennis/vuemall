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
  res.json({
    status:"0",
    msg:'',
    result:"suc"
  });
});

module.exports = router;
