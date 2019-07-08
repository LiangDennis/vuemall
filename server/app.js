var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 登录拦截，捕获登录，在注入下面的路由之前拦截
app.use((req, res, next) => {
  // console.log("登录拦截");
  // 通过检测客户端保存的cookies值
  if(req.cookies.userId) {
    next();
  }else {
    // 设置一些白名单
    if(req.originalUrl =="/users/login" || req.originalUrl == "/users/logout" || 
    // 第一种方式来截取/goods/list进入白名单
    // req.originalUrl.indexOf("/goods/list") >-1) {
    // 第二种方式，通过req.path获取的就是/goods/list没有任何参数，参照location.pathname和location.href来实现的。location.pathname就是一个路径不带任何参数，而location.href带参数。
    req.path == "/goods/list") {
      next();
    }else {
      // 拦截，返回响应
      res.json({
        status:"10001",
        msg:"当前未登录",
        result:""
      });
    }
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
