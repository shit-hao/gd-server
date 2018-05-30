var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://localhost:27017/';
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("数据库已连接!");
//   // db.close();
//   // 插入
//   // var dbo = db.db("gd");
//   // var myobj = { name: "菜鸟教程", url: "www.runoob" };
//   // dbo.collection("allUser").insertOne(myobj, function(err, res) {
//   //       if (err) throw err;
//   //       console.log("文档插入成功");
//   //       db.close();
//   //   });
//   // 查询
//   // var dbo = db.db("gd");
//   //   dbo.collection("allUser"). find({}).toArray(function(err, result) { // 返回集合中所有数据
//   //       if (err) throw err;
//   //       console.log(result);
//   //       db.close();
//   //   });
  

// });


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
  console.log('all')
  res.header("Access-Control-Allow-Origin", req.headers.origin); //需要显示设置来源
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials",true); //带cookies7     res.header("Content-Type", "application/json;charset=utf-8");
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

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
