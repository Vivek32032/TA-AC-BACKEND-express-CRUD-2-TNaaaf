var express = require('express');
var router = express.Router();
var Book = require('../model/book')

/* GET home page. */
router.get('/',(req,res)=>{

  Book.find({},(err,books) =>{
      console.log(err,books)
      if(err) return next(err);
  res.render('bookList', {books: books});
  });

})
router.get('/new',(req,res)=>{
  res.render('addBook')
})

router.post('/',(req,res,next)=>{
  Book.create(req.body,(err,createdBook)=>{
       console.log(createdBook);
       if(err) return next(err);
       res.redirect('/books')
  })
})
router.get('/:id',(req,res,next)=>{
  var id = req.params.id;
  Book.findById(id).populate('authors').exec((err,book)=>  {
       if(err) return next(err);
        res.render('bookDetails', { book: book});
  })
     
     
});
router.get('/:id/edit',(req,res,next)=>{
  var id = req.params.id;
  Book.findById(id,(err,book)=>{
      if(err) return next(err);
      res.render('editBookForm',{book:book})
  })
})

router.post('/:id',(req,res)=>{
  var id = req.params.id;
  Book.findByIdAndUpdate(id,req.body,(err,updatedBook)=>{
      if(err) return next(err);
      res.redirect("/books/"+ id)
  })
})

//delete
router.get('/:id/delete',(req,res,next)=>{
  var id = req.params.id;
  Book.findByIdAndDelete(id,(err,book)=>{
      if(err) return next(err);
      // if we delete book each comment related to it must be deleted.
      Comment.deleteMany({ bookId : book.id}, (err,info) =>{
          res.redirect('/books');
      })
  })
})
router.post("/:id/comments",(req,res,next)=>{
  var id = req.params.id;
  req.body.bookId = id;
  Comment.create(req.body,(err, comment)=>{
      if(err) return next(err);
      // update book with comment id into comments section
      Book.findByIdAndUpdate(id, {$push : {comments: comment._id}},(err,updatedBook)=>{
          if(err) return next(err);
          res.redirect('/books/' + id) 
      })
  }) 
})

module.exports = router;