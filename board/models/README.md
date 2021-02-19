**Post-User간 Relationship 만들기**

게시물에 작성자를 추가하려고 한다.  게시물(Post)과 사용자(User) 사이에 관계(Relationship)를 만들어보자.

Post document 에 User document id 를 기록하여 글 작성자 정보를 알 수 있게 하려고한다.

기존 Post 스키마에 author라는 항목을 추가해준다. 이 항목은 User 스키마의 id 와 연결된다.

```js
//models/Post.js
//schema

//models/user.js 에서 var user = mongoose.model('user', userSchema); model.exports = User; 로 모듈화하였다. 즉 스키마 이름이 'user'로 되어있음 아래 ref 하는 스키마가 얘라는 것.
var postSchema = mongoose.Schema({
  title:{type:String, required:[true,'...']},
  body:{type:String, required:[true,'...']},
  author:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true}, // user 스키마를 ref 함으로써 relationship 이 형성 되었음.
  createdAt:{type:Date, default:Date.now},
  updatedAt:{type:Date},
});


```

 **`Model.populate()`** 

: relationship이 형성되어 있는 항목의 값을 생성해 준다. 현재 Post 의 author 항목에는 User document의 id 가 기록되어있는데, 이 값을 바탕으로 실제 user의 값을 author에 생성하게 된다. (User 상세한 항목은 프론트 템플릿 엔진에서 참조한다. )



```js
//routes/posts.js
var util = require('../util'); // *

//create
router.post('/', function(req,res){
  req.body.author = req.user._id;
  Post.create(req.body, function(err, post){
    if(err){
      req.flash('post', req.body)
      req.flash('errors', utils.parseError(err)) // * utils.parseError는 내가 모듈화 해준 예외 처리 함수
      return res.redirect('/posts/new');
    }
    res.redirect('/posts');
  });
});
// Index
router.get('/', function(req,res){
  Post.find({}).populate('author').sort('-createdAt').exec(function(err, posts){
    if(err) return res.json(err);
    res.render('posts/index', {posts:posts});
  });
});
//show
router.get('/:id', function(req,res){
  Post.findOne({_id:req.params.id}).populate('author').exec(function(err,posts){
    if(err) return res.json(err);
    res.render('posts/show', {post:post});
  });
});
```

