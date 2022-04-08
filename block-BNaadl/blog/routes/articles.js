var express = require('express');
var router = express.Router();
var Article = require('../models/Article')


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
    Article.findById( id, (err,articles)=>{
        if(err) return next(err);
        res.render('singleArticleDetails', {articles:articles});
    })
} )

router.get('/:id/edit',(req,res,next)=>{
    var id = req.params.id;
    Article.findById( id, (err,articles)=>{
        if (err) return next(err);
        res.render('editArticle',{articles:articles});
    })
})

router.post('/:id/post', (req,res,next)=>{
    var id = req.params.id;
    Article.findByIdAndUpdate( id, req.body, (err,articles)=>{
        if(err) return next(err);
        // res.redirect('/articles/'+id+'/detail')
        res.redirect('/articles/articles')
        // res.render('detailedArticle',{articles:articles})
    } )
});

router.get( '/:id/delete', (req,res,next)=>{
    var id = req.params.id;
    Article.findByIdAndDelete( id, (err,articles)=>{
        if(err) return next(err);
        res.redirect('/articles/');
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

module.exports = router;