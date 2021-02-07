var express = require('express');
var router = express.Router();
var Content = require('../models/Content');

// Index
router.get('/', function(req, res){
  Content.find({}, function(err, contents){
    if(err) return res.json(err);
    res.render('contents/index', {contents:contents});
  });
});

// New
router.get('/new', function(req, res){
  res.render('contents/new');
});

// create
router.post('/', function(req, res){
  Content.create(req.body, function(err, content){
    if(err) return res.json(err);
    res.redirect('/contents');
  });
});

// show
router.get('/:id', function(req, res){
  Content.findOne({_id:req.params.id}, function(err, content){
    if(err) return res.json(err);
    res.render('contents/show', {content:content});
  });
});

// edit
router.get('/:id/edit', function(req, res){
  Content.findOne({_id:req.params.id}, function(err, content){
    if(err) return res.json(err);
    res.render('contents/edit', {content:content});
  });
});

// update
router.put('/:id', function(req, res){
  Content.findOneAndUpdate({_id:req.params.id}, req.body, function(err, content){
    if(err) return res.json(err);
    res.redirect('/contents/'+req.params.id);
  });
});

// destroy
router.delete('/:id', function(req, res){
  Content.deleteOne({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect('/contents');
  });
});

module.exports = router;
