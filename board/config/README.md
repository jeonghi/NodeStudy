**session based Auth (세션 기반 인증)**

로그인을 성공하게 되면 sever 의 **session** 에 기록이 되고 다음번 request 부터는 로그인한 상태로 인식하게 된다.

로그인하려고 post 로 서버에 로그인 요청을 하면 session 아이디와,권한등을 request 로 브라우저(클라이언트)에게 보내게 된다. 쿠키안에 seesion 을 넣어서 response 해줌 -> 클라이언트에서는 이제 계속 cookie에 session 정보와 함께 request하게 됨 -> session id가 서버상에 있다면 로그인 되었을 때 보여져야할 페이지가 보여질 것임.! -> 유저들이 한번 접속 할때 마다 session을 찾고 session id를 확인하고 timeout을 업데이트하고 권한을 확인한 뒤에 조건에 맞는 웹 페이지를 response 해야함! I/O 가 상당히 높은 작업이 됨 :cry: ​ -> 그렇기 때문에 많은 웹 서버에서는 내부에 session 을 RAM이라는 공간에 DB 형식으로 저장 (local DB)해놓는다. 여기까지가 세션과 쿠키를 이용한 인증의 기본 동작원리임. -> JWT

- 쿠키(cookie)
- 세션(session)
- 캐시(cache)
- serialize
- deserialize

세션 기반 인증 구현시에 필요한 패키지는 다음과 같다.

```js
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var flash = require('connect-flash')
app.use(flash());
```

- passport : 인증관련된 모듈을 처리해주는 인증 시스템을 위한 기본 패키지

- Passport-local (passport strategy package, 구체적인 인증방법을 구현하는 패키지) : 페이스북과 같은 소셜로그인말고 로컬 디비에 저장하고 하는등의 일반적인 로그인 처리를 해줌.

- Express-session: 세션 관련 처리

- Connect-flash : 에러메시지 같은 것들을 redirect 하는과정에서 좀 더 쉽게 할 수 있도록 해줌.

**serialize** 

로그인할때 DB로 부터 user를 찾고 session 에 user 정보 일부를 등록하는 것.

<보통 session에 user 일부 정보만 저장하는 이유>

- User 정보 전체를 session에 저장할 수도 있지만, session에 저장되는 정보가 너무 많아지면 다중 사용자 서비스시에 서버에서 감당할 수가 없다. 

- 회원 정보 수정을 통해 user object 가 변경되더라도 전체 user정보가 session에 저장되어 있는 경우 해당 부분을 변경해 주어야하는 등의 문제가 있다.

```js
// passport 에서 serialize 하는 방법
// login 시에 DB에서 발견한 user를 어떻게 session에 저장할지를 정함.
passport.serializeUser(function(user, done){
  //console.log('passport session save:', user.id)
  done(null, user.id) // 여기서는 user의 id정보만 session에 저장
});
```

**deserialize** 

session에 등록된 user 정보로부터 해당 user를 object로 만드는 과정.

서버에 request 가 올 때마다 deserialize 을 거침.

`passport.deserializeUser` 함수는 request 시에 session에서 어떻게 user object 를 만들지를 정하는 부분임. 

매번 request 마다 user 정보를 DB에서 새로 읽어오는데, user 정보가 변경되면 바로 변경된 정보가 반영되는 장점이 있다. 다만 매번 request마다 DB에서 user 정보를 읽어와야하는 단점이 있다. 1) User 정보를 전부 session에 저장하여 DB접촉을 줄이거나, 아니면 2 ) request 마다 user를 db에서 읽어와서 데이터의 일관성을 확보하거나 자신의 상황에 맞게 선택하면 된다.

```js
// passport 에서 deserialize 하는 방법 
var User = require('../models/User')
passport.deserializeUser(function(id, done){
  User.findOne({_id:id}, function(err, user){
    done(err, user);
  });
});
```

**local strategy**

```js
// var passport = require('passport')
// var LocalStrategy = require('passport-local').Strategy
passport.use('local-login', new LocalStrategy({
  usernameField : 'username',
  passwordField : 'password',
  passReqToCallback : true}, function(){}));
```

**session**

```js
// session 사용법
// var passport = require(./config/passport)
app.use(session({
  secret:'MySecret',
  resave: true,
  saveUninitialized : true
}));

app.use(passport.initialize());
app.use(passport.session());
```





 

