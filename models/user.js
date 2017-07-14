var mysql = require('mysql')
var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'nodejs'
});

var connect = function(){
    con.connect(function(err) {
    if (err) throw err;
    console.log("Connected databse!");
    })
}
var getuser = function(id){
   var query = "select * from user where ?";
    con.query(query,function(err,result){
    console.log(result);
    }); 
}
var adduser = function(id){
   var query = "select * from user where ?";
    con.query(query,function(err,result){
    console.log(result);
    }); 
}


module.exports.connect = connect;
module.exports.getuser = getuser;