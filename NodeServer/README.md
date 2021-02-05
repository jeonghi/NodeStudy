Express 는 Node 웹 프레임 워크이면서 다른 프레임워크의 기본 라이브러리이다.

> 1. HTTP 통신요청 (GET, PUT, DELETE, POST) 에 대한 **핸들러**를 만든다.
>
> 2. 템플릿에 데이터를 넣어 response 를 만들기 위해 view의 **렌더링 엔진**과 결합한다.
>
> 3. 접속을 위한 포트나 응답 렌더링을 위한 템플릿 위치 같은 공통 웹 어플리케이션 세팅을 한다
>
> 4. 핸들링 파이프라인 중 필요한 곳에 추가적인 미들웨어 처리 요청을 추가할 수 있다.
> 



```javascript
var express = require('express'); // 모듈의 생성과
var app = express(); // 불러옴
```
1. CORS 문제 해결

```javascript
var cors = require('cors');
app.use(cors());
```

2. 서버 호스팅 시작

```javascript
app.listen(8081, function(){...});
```
 2.1. 라이브 호스팅 (유용한 툴) 
`nodemon app.js` 과 같이 사용

3. 정적 객체 라우팅 안해주고도 접근 가능하게끔 하는 방법

```javascript
app.use(express.static('public')) // public라는 디렉토리 하위의 객체들에 접근 가능
```

4. GET 요청시 response 해주기

```javascript
app.get('/', function(req,res){
  res.send("<h1>나는야 짱짱맨ㅎㅎ</h1>")
});
```

5. GET 요청시 file을 response 해주기

```javascript
app.get('/', function(req,res){
  res.sendFile(__dirname + "/public/main.html")
});
```

6. POST 요청시 템플릿 response 해주기

```javascript
var bodyParser = require('body-parser');
app.use(bodyParser.urlenceded({extended:true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs') // 템플릿에 데이터를 넣어 res를 만들기 위해 view 랜더링 엔진과 결합한다
app.post('/email_post', function(req,res){
  res.render('email.ejs',{'email': req.body.email}) // 템플릿 파일 이름, 템플릿 변수에 값 포멧팅 
});
```
6.1. 템플릿 파일 email.ejs 예시

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
  	<title>템플릿 예시</title>
</head>
<body>
    <h1> 너 이메일 주소가 모니? <%= email %> 라고? </h1>

</body>
</html>
```

7. POST 요청시 JSON 형태로 response 해주기

```javascript
app.post('/ajax_send_email', function(req,res){
  // 응답을 주기전에 DB를 확인해서 check validation을 해줘야한다. if ~ return 200 OK else return ERROR
  var responseData = {'result':'OK', 'email':req.body.email}
  res.json(responseData);
});
```

​	7.1. 폼 태그로 POST 데이터 요청 양식

```html
<form action = "/email_post" method="post">
  email : <input type = "text" name = "email"> <br/>
  <input type = "submit"
</form>
```

​	7.2. 이벤트 발생용 버튼 태그로 POST 데이터 요청 양식

```html
<button class='ajaxsend'>
   ajax_send
</button>
<script>
  document.querySelector('.ajaxsend').addEventListener('click', function(){
    var inputData = document.forms[0].elements[0].value; // email 데이터 값 의미함
    sendAjax('http://localhost:8081/ajax_send_email', inputData);
  });
  
  function sendAjax(url, data){
    var data = {'email' : data};
    data = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', "application/json");
    xhr.send(data);
    xhr.addEventListener('load', function(){
      var result = JSON.parse(xhr.responseText);
      if(result.result !== "OK")
    })
  }
</script>
```

​	7.3. form.html 예시

```html
<body>
    <form action = "/email_post" method="post">
        email : <input type = "text" name="email"><br/>
        <input type = "submit">
    </form>

    <button class="ajaxsend"> ajax_send </button>
    <div class ="result"></div>
    <script>
        document.querySelector('.ajaxsend').addEventListener('click', function(){
            var inputdata = document.forms[0].elements[0].value;
            sendAjax('http://127.0.0.1:8081/ajax_send_email', inputdata);
        });
        function sendAjax(url, data){
            var data = {'email' : data };
            data = JSON.stringify(data);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.setRequestHeader('Content-Type', "application/json");
            xhr.send(data);
            xhr.addEventListener('load', function(){
                // console.log(xhr.responseText);
                var result = JSON.parse(xhr.responseText);
                if(result.result !== "ok") return;
                document.querySelector('.result').innerHTML = result.email;
            });
        };
    </script>
</body>
```

