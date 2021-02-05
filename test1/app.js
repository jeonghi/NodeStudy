var express = require('express')
var app = express()
var cors = require('cors');
var bodyParser = require('body-parser')
app.use(cors());
const port = 8081
app.listen(port, function(){console.log("hosting start port 8081...")});
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/searching.html');
});
app.post('/search_keyword', function(req, res){
    var responseData = req.body.keyword;
    if(responseData !== '박정환'){
        responseData = {'result':'Not Found', 'result_data':'그딴거 없다'}
    }else {
        responseData = {'result': 'GOOD 그뤠잇~!', 'result_data': '정환이는 짱짱맨'}
    }
    res.json(responseData);
})

