var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/';


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});
router.post('/api/login', (req, res, next) => {

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("数据库已连接!");
    let username = req.body.param.username
    let password = req.body.param.pwd
    // 查询
    console.log(username, password)
    var dbo = db.db("gd");
    var whereStr = {
      "userName": username
    }; // 查询条件
    dbo.collection("allUser").find(whereStr).toArray(function (err, result) { // 返回集合中所有数据
      if (err) throw err;
      console.log('login')
      console.log(result[0])
      if (result.length > 0) {
        if (!result[0].token) {
          var token = new Buffer(username).toString('base64');
          console.log("get the decodestr " + token);
          let updateStr = {
            $set: {
              "token": token
            }
          };
          dbo.collection("allUser").updateOne(whereStr, updateStr, function (err, res) {
            if (err) throw err;
            console.log("文档更新成功");
          });
        }
        if (result[0].password == password) {
          console.log(token || result[0].token)
          res.cookie('token', token || result[0].token)
          res.json({
            code: 0,
            preRecord: result[0].preRecord,
            msg: 'success',
            token: result[0].token,
            username: result[0].userName
          })
          res.end('cookies set ok')
        }
      } else {
        res.json({
          code: 1,
          msg: '没有此账号'
        })
      }
      db.close();
    });
  });
})
router.post('/api/check', (req, res, next) => {

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("数据库已连接!");
    let username = req.body.param.username
    // 查询
    console.log(username)
    var dbo = db.db("gd");
    var whereStr = {
      "userName": username
    }; // 查询条件
    console.log(whereStr)
    dbo.collection("allUser").find(whereStr).toArray(function (err, result) { // 返回集合中所有数据
      if (err) throw err;
      console.log(result)
      if (result.length > 0) {
        res.json({
          code: 0,
          msg: '存在',
          preRecord: result[0].preRecord
        })
      } else {
        res.json({
          code: 1,
          msg: '没有此账号'
        })
      }
      db.close();
    });
  });
})
router.post('/api/regist', (req, res, next) => {
  MongoClient.connect(url, function (err, db) {
    // console.log(req.body)
    let {
      username,
      pwd
    } = req.body.param

    if (err) throw err;
    var dbo = db.db("gd");
    let whereStr = {
      "userName": username
    };
    var user = {
      userName: username,
      password: pwd,
      token: '',
      preRecord: []
    };
    dbo.collection("allUser").find(whereStr).toArray(function (err, result) { // 返回集合中所有数据
      if (err) throw err;
      if (result.length == 0) {
        dbo.collection("allUser").insertOne(user, function (err) {
          if (err) throw err;
          console.log("文档插入成功");
          res.json({
            code: 0,
            msg: 'success'
          })
        });
      } else {
        res.json({
          code: 1,
          msg: '该账号已存在'
        })
      }
      db.close();
    });
  });

})
router.post('/api/savePreRecord', (req, res, next) => {
  MongoClient.connect(url, function (err, db) {
    let record = (req.body.param.preRecord)
    console.log(req.body.param.preRecord)
    let username = req.body.param.username
    if (err) throw err;
    var whereStr = {
      "userName": username
    }; // 查询条件
    var dbo = db.db("gd");
    let updateStr = {
      $set: {
        "preRecord": record
      }
    };
    dbo.collection("allUser").updateOne(whereStr, updateStr, function (err) {
      if (err) throw err;
      console.log("文档更新记录成功");
      res.json({
        code: 0,
        msg: 'success'
      })
    });
  })
})
router.post('/api/reset', (req, res, next) => {
  MongoClient.connect(url, function (err, db) {
    let username = req.body.param.username
    if (err) throw err;
    var whereStr = {
      "userName": username
    }; // 查询条件
    var dbo = db.db("gd");
    let updateStr = {
      $set: {
        "preRecord": ''
      }
    };
    dbo.collection("allUser").updateOne(whereStr, updateStr, function (err) {
      if (err) throw err;
      console.log("文档更新记录成功");
      res.json({
        code: 0,
        msg: 'success'
      })
    });
  })
})
router.post('/test', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'post')
  res.header('Cache-Control', 'max-age=3600')
  res.cookie('hhh', 'klkl')
  res.json({
    a: 1,
    b: 2,
    c: 3,
    d: 4
  })
})

module.exports = router;