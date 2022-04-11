var express = require('express');
var router = express.Router();
var Article = require('../model/article')
var Comment = require('../model/comment')


router.get('/:id/edit',(req,res)=>{
    var id = req.params.id;
    Comment.findById(id,(err,comment) => {
        if(err) return next(err);
        res.render('updateComment',{ comment })
    })
})

router.post('/:id',(req,res,next)=> {
    var id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body ,(err,updatedComment)=>{
        res.redirect('/articles/' + updatedComment.articleId)
    })
})

router.get('/:id/delete',(req,res)=>{
    var id = req.params.id;
    Comment.findByIdAndRemove(id,(err,comment)=>{
        if(err) return next(err);
        Article.findByIdAndUpdate(comment.articleId , { $pull : {comments : comment._id}},(err,article)=>{
    
         res.redirect("/articles/"+ comment.articleId)
        })
    })
})

// like logic
router.get( '/:id/likes', (req,res,next)=>{
    var id = req.params.id;
    var like = req.body.likes
    var counter = like === 'likes' ? 1 : +1;
    Comment.findByIdAndUpdate( id, {$inc: {likes: counter}}, (err,comment)=>{
        if(err) return next(err);
        res.redirect('/articles/'+comment.articleId);
    }  )
})

//dislike logic
router.get( '/:id/dislikes', (req,res,next)=>{
    var id = req.params.id;
    var dislike = req.body.dislikes;
    var counter = dislike === 'dislikes' ? 1 : +1 ;
    Comment.findByIdAndUpdate( id, {$inc: {dislikes: counter}}, (err,comment)=>{
        if(err) return next(err);
        res.redirect('/articles/'+comment.articleId);
    }  )
})

module.exports = router;