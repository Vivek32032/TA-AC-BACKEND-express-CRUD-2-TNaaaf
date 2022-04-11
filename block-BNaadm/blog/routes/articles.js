var express = require('express');
var router = express.Router();
var Article = require('../model/article');
var Comment = require('../model/comment');


router.get('/', (req,res,next)=>{
    console.log(Article);
    Article.find({},(err,articles)=>{
        if(err) return next(err);
        res.render('articles',{ articles : articles });
    });
} );

router.get('/new', (req,res,next)=>{
    res.render('addArticle');
})

router.post('/', (req,res,next)=>{
    console.log(req.body);
    Article.create( req.body, (err,articles)=>{
        if(err) return next(err);
        res.redirect('/articles');
    } )
} )


router.get( '/:id', (req,res,next)=>{
    var id = req.params.id;
    Article.findById(id).populate('comments').exec((err,article)=>  {
        if(err) return next(err);
        res.render('singleArticleDetails', {article:article});
    })
} )

router.get('/:id/edit',(req,res,next)=>{
    var id = req.params.id;
    Article.findById( id, (err,article)=>{
        if (err) return next(err);
        res.render('editArticle',{article:article});
    })
})

router.post('/:id', (req,res,next)=>{
    var id = req.params.id;
    Article.findByIdAndUpdate( id, req.body, (err,updatedarticle)=>{
        if(err) return next(err);
        res.redirect('/articles/'+id)
    } )
});

router.get( '/:id/delete', (req,res,next)=>{
    var id = req.params.id;
    Article.findByIdAndDelete( id, (err,article)=>{
        if(err) return next(err);
        // if we delete article each comment related to it must be deleted.
        Comment.deleteMany({ articleId : article.id}, (err,info) =>{
            res.redirect('/articles');
        })
    })
} );

// like logic
router.get( '/:id/like', (req,res,next)=>{
    var id = req.params.id;
    var like = req.body.likes
    var counter = like === 'likes' ? 1 : +1;
    Article.findByIdAndUpdate( id, {$inc: {likes: counter}}, (err,articles)=>{
        if(err) return next(err);
        res.redirect('/articles/'+id);
    }  )
})

//dislike logic
router.get( '/:id/dislike', (req,res,next)=>{
    var id = req.params.id;
    var dislike = req.body.likes
    var counter = dislike === 'likes' ? 1 : -1 ;
    Article.findByIdAndUpdate( id, {$inc: {likes: counter}}, (err,articles)=>{
        if(err) return next(err);
        res.redirect('/articles/'+id);
    }  )
})

router.post("/:id/comments",(req,res,next)=>{
    var id = req.params.id;
    req.body.articleId = id;
    Comment.create(req.body,(err, comment)=>{
        if(err) return next(err);
        // update book with comment id into comments section
        Article.findByIdAndUpdate(id, {$push : {comments: comment._id}},(err,updatedArticle)=>{
            if(err) return next(err);
            res.redirect('/articles/' + id) 
        })
    }) 
})

module.exports = router;