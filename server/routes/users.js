var express = require('express');
var router = express.Router();

require('./../util/util')

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
  // console.log("删除购物车数据");
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

// 删除地址
router.post("/delAddress", (req,res,next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  User.update({
    userId:userId
  },{
    // 删除的方式
    $pull: {
      "addressList":{
        "addressId":addressId
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

// 生成订单
router.post("/payMent", (req, res, next)=> {
  let userId = req.cookies.userId;
  let orderTotal = req.body.orderTotal;
  let addressId = req.body.addressId;
  console.log(addressId);

  // 创建订单的方式，如订单号等等
  User.findOne({userId:userId}, (err,doc)=> {
    if(err) {
      res.json({
        status:"1",
        msg:err.message,
        result:""
      });
    }else {
      let address ="";
      // 获取当前用户的地址信息，选取选中的地址
      doc.addressList.forEach(item => {
        if(addressId == item.addressId) {
          address = item;
        }
      });
      let goodsList = [];
      // 获取当前用户购物车的购买商品
      doc.cartList.filter(item => {
        if(item.checked == "1") {
          goodsList.push(item);
        }
      });

      // 生成orderId
      // 平台码
      let platform = "622";
      // 随机数
      let r1 = Math.floor(Math.random()*10);
      let r2 = Math.floor(Math.random()*10);
      // 日期时间
      let sysDate = new Date().Format("yyyyMMddhhmmss");//id值
      let createDate = new Date().Format("yyyy-MM-dd hh:mm:ss");//时间
      let orderId = platform+r1+sysDate+r2;//订单Id不一定是唯一的。

      // 生成订单信息
      let order = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:"1",
        createDate:""
      };
      doc.orderList.push(order);
      // 保存到数据库
      doc.save((err1,doc1) => {
        if(err1) {
          res.json({
            status:"1",
            msg:err1,message,
            result:""
          });
        }else {
          // 返回对象
          res.json({
            status:"0",
            msg:"",
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal//下一个页面会用到
            }
          });
        }
      });

    }
  });
});

// 根据订单Id查询订单信息
router.get("/orderDetail", (req,res,next)=> {
  let userId = req.cookies.userId;
  let orderId = req.param("orderId");//get的方式获取参数
  User.findOne({userId:userId},(err,userInfo) => {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      });
    }else {
      let orderList = userInfo.orderList;
      // 只有当有订单时
      if(orderList.length>0) {
        let orderTotal = 0;
        orderList.forEach(item => {
          if(item.orderId == orderId) {
            orderTotal = item.orderTotal;
          }
        });
        // 小于或者等于0元的订单为无效，只有订单大于0才有效
        if(orderTotal >0 ) {
          res.json({
            status:"0",
            msg:"",
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          });
        }else {
          res.json({
            status:'120002',
            msg:"无此订单",
            result:""
          });
        }
      }else {
        res.json({
          status:'120001',
          msg:"当前用户未创建订单",
          result:""
        });
      }
    }
  });
});

// 查询购物车商品数量
router.get("/getCartCount",(req,res,next) => {
  let userId = req.cookies.userId;
  User.findOne({userId:userId}, (err, doc) => {
    if(err) {
      res.json({
        status:"1",
        msg:err.message,
        result:''
      });
    }else {
      let cartList = doc.cartList;
      let cartCount =0;
      cartList.map(item => {
        cartCount += parseInt(item.productNum);
      });
      res.json({
        status:"0",
        msg:"",
        result:cartCount
      });
    }
  });
});
module.exports = router;
