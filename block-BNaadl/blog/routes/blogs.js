var express = require('express');
var router = express.Router();
var Article = require('../models/article')

/* GET users listing. */
// router.get('/',(req, res, next) =>{
//     res.render("listArticles")
// });
router.get( '/', (req,res,next)=>{
    Article.find({},(err,articles)=>{
        if (err) return next(err);
        res.render('listArticles',{articles:articles});
    });
} );
router.get('/new', (req,res,next)=>{
    res.render('addArticle');
})

router.post('/new', (req,res,next)=>{
    Article.create( req.body, (err,articles)=>{
        if (err) return res.redirect('/blogs/new')
        res.redirect('/blogs');
    } )
} )




router.get( '/:id/detail', (req,res,next)=>{
    var id = req.params.id;
    Article.findById( id, (err,articles)=>{
        if (err) return next(err);
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
        if (err) return next(err);
        // res.redirect('/blogs/'+id+'/detail')
        res.redirect('/blogs/listArticles')
        // res.render('detailedArticle',{articles:articles})
    } )
});

router.get( '/:id/delete', (req,res,next)=>{
    var id = req.params.id;
    Article.findByIdAndDelete( id, (err,articles)=>{
        if (err) return next(err);
        res.redirect('/blogs/listArticles');
    })
} );

// like logic
router.get( '/:id/like', (req,res,next)=>{
    var id = req.params.id;
    var like = req.body.likes
    var counter = like === 'likes' ? 1 : +1;
    Article.findByIdAndUpdate( id, {$inc: {likes: counter}}, (err,articles)=>{
        if (err) return next(err);
        res.redirect('/blogs/'+id+'/detail');
    }  )
})

//dislike logic
router.get( '/:id/dislike', (req,res,next)=>{
    var id = req.params.id;
    var dislike = req.body.likes
    var counter = dislike === 'likes' ? 1 : -1 ;
    Article.findByIdAndUpdate( id, {$inc: {likes: counter}}, (err,articles)=>{
        if (err) return next(err);
        res.redirect('/blogs/'+id+'/detail');
    }  )
})

module.exports = router;