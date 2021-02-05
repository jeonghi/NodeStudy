var express = require('express')
var app = express()
var cors = require('cors');
var bodyParser = require('body-parser')
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
    console.log(req.body.email);
    // 얘는 받은 데이터이다. 여기서 해야할일은 응답을 주기전에 db를 확인해서 check validation을 해줘야한다. 
    var responseData = {'result':'ok', 'email':req.body.email}
    res.json(responseData)
});