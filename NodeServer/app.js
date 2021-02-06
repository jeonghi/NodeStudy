var express = require('express')
var app = express()
var cors = require('cors');
var bodyParser = require('body-parser')
var mysql = require('mysql')
var connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'jeonghi' ,
    password: 'a123456789',
    database: 'js_test',
})
connection.connect();
app.use(cors());
const port = 8081
app.listen(port, function(){console.log("Hello~")});
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

app.set('view engine','ejs')
/* app.get('/', function(req, res){
    res.send("<h1>Hello Node</h1>")
}); */
app.get('/', function(req, res){
    res.sendFile(__dirname + "/public/main.html");
});

app.post('/email_post', function(req,res){
    // get : req.param
    // post 는 body parser 가 별도로 필요하다 npm install body-parser --save
    console.log(req.body.email)
    //res.send("<h1>Welcome mail" + req.body.email + "</h1>")
    res.render('email.ejs', {'email' : req.body.email})
})

app.post('/ajax_send_email', function(req,res){
    var email = req.body.email;
    var responseData = {};
    var query = connection.query('select name from user where email="'+email+'"',function(err, rows){
        if(err){ throw err;}
        console.log(rows[0]);
        if(rows[0]){
            responseData.result = 'ok'
            responseData.name = rows[0].name;
        }else{
            responseData.result = "none";
            responseData.name = "";
        }
        res.json(responseData);
    })
});