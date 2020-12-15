const { Router } = require("express")
const express = require ("express")
const {getBooks,writeBooks} = require("../../fsUtilities")
const booksRouter = express.Router()
booksRouter.get("/",async(req,res,next)=>{ //get http:localhost:5001/books?category=scienf&title=whatever  (after ? it's the req.query)

    try{
        const books = await getBooks()
        console.log(req.query)
        if(req.query && req.query/category){
            const filteredBooks = books.filter(book=>book.hasOwnProperty("category") && books.category===req.query.category )
            res.send(filteredBooks)
        }
    }catch(err){
        console.log(err)
        next(err)
    }


})
booksRouter.get("/:asin",async(req,res,next)=>{
   try{
    const books = await getBooks()
    const booksFound = books.find(book=>book.asin === req.params.asin)
    if(booksFound){
        res.send(booksFound)
    }else{
        const error =  new Error() 
        error.httpStatusCode = 404;
        next (error)
    }
   }catch(error){console.log(error)
next (error)}




})
booksRouter.post("/",async(req,res,next)=>{
    try{
        const books = await getBooks()
        const find_asin = books.find(book.asin=== req.body.asin)
        if(find_asin){
            const err = new Error();
            err.httpStatusCode = 400;
            next(err)
        }else{
            books.push(req.body)
            await writeBooks(books)
            res.status(201).send()
        }
    }catch(err){console.log(err)
    next(err)}



})
booksRouter.put("/:asin",async(req,res,next)=>{
    try{
        const books = await getBooks();
        const findindexbook = books.findIndex(book=>book.asin === req.body.asin) 
        if(findindexbook!==-1){// if it found the index then:
            const updatebooks = [...books.slice(0,findindexbook), {...req.body}, books.slice(findindexbook+1)]
            await writeBooks(updatebooks)
            res.status("ok").send()

        }else{
            const error = new Error()
            error.httpStatusCode = 404;
            next(error)
        }
    }catch(err){console.log(err)
    next(err)}



})
booksRouter.delete("/:asin",async(req,res,next)=>{

    try{
        const books = await getBooks();
        const filteredbooks = books.filter(book=>book.asin !== req.body.asin) 
        
            await writeBooks(filteredbooks)
           res.status(204).send() // status 204 No content 

        
    }catch(err){console.log(err)
    next(err)}


})
module.exports=booksRouter