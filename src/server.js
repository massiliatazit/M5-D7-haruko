const express = require("express")
const cors = require("cors")
const listEndpoints = require ("express-list-endpoints")
const {
    notFoundHandler,
    unauthorizedHandler,
    forbiddenHandler,
    badRequestHandler,
    catchAllHandler,
  } = require("./errorHandling")
const booksRouter = require("./services/books")

const server = express()
const port = process.env.PORT || 5001
whitelist=[]
server.use(cors({origin:function(orgin,callback){}}))
server.use(express.json() )//to understand what we have inside body otherwise it will be undefined.
server.use("/books", booksRouter)// has to be after json(the body) and after cors(frontend) otherwise it'll be undefined
server.use(badRequestHandler) // error has to be after the route because it comes on next (in middlewares errors handling)
server.use(notFoundHandler)
server.use(catchAllHandler)
server.use(forbiddenHandler)
server.use(unauthorizedHandler)

console.log(listEndpoints(server))

server.listen(port,()=>{
    console.log(`server is listening on port ${port}`)
})