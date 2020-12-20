const express = require("express");
const { getBooks, writeBooks } = require("../../lib/fsUtilities");
const booksRouter = express.Router();
const { check, validationResult } = require("express-validator");
const uniqid = require("uniqid");

const commentsValidation = [
  check("UserName").exists().withMessage("Username is required"),
  check("Text").exists().withMessage("Text is required"),
];
booksRouter.get("/", async (req, res, next) => {
  //get http:localhost:5001/books?category=scienf&title=whatever  (after ? it's the req.query)

  try {
    const books = await getBooks();
    console.log(req.query);
    if (req.query && req.query.category) {
      const filteredBooks = books.filter(
        (book) =>
          book.hasOwnProperty("category") &&
          book.category === req.query.category
      );

      res.send(filteredBooks);
    } else {
      res.send(books);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});
booksRouter.get("/:asin", async (req, res, next) => {
  try {
    const books = await getBooks();

    const filteredBooks = books.filter((book) => book.asin === req.params.asin);

    if (filteredBooks.length > 0) {
      res.send(filteredBooks);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
booksRouter.post("/", async (req, res, next) => {
  try {
    const books = await getBooks();
    const find_asin = books.find((book) => book.asin === req.params.asin);
    if (find_asin) {
      const err = new Error();
      err.httpStatusCode = 400;
      err.message = "Book already exist";
      next(err);
    } else {
      books.push({ ...req.body });
      await writeBooks(books);
      res.status(201).send();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});
booksRouter.put("/:asin", async (req, res, next) => {
  try {
    const books = await getBooks();
    const findindexbook = books.findIndex(
      (book) => book.asin === req.body.asin
    );
    if (findindexbook !== -1) {
      // if it found the index then:
      const updatebooks = [
        ...books.slice(0, findindexbook),
        { ...req.body },
        books.slice(findindexbook + 1),
      ];
      await writeBooks(updatebooks);
      res.status("ok").send();
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});
booksRouter.delete("/:asin", async (req, res, next) => {
  try {
    const books = await getBooks();
    const filteredbooks = books.filter((book) => book.asin !== req.params.asin);

    await writeBooks(filteredbooks);
    res.status(204).send(); // status 204 No content
  } catch (err) {
    console.log(err);
    next(err);
  }
});
booksRouter.get("/:asin/comments", async (req, res, next) => {
  try {
    const books = await getBooks();
    const bookfind = books.find((book) => book.asin === req.params.asin);// why filter doesn't work here?
    if (bookfind) {
  
      res.send(bookfind.comments);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});
booksRouter.post(
  "/:asin/comments",
  commentsValidation,
  async (req, res, next) => {
    try {
      const books = await getBooks();
      const bookIndex = books.findIndex(
        (book) => book.asin === req.params.asin
      );
      console.log(bookIndex)
      if (bookIndex !== -1) {
        //book found

        books[bookIndex].comments.push({
          ...req.body,
          commentId: uniqid(),
          createdAt: new Date(),
        });
        await writeBooks(books);
        res.status(201).send(books);
      } else {
        const err = new Error();
        err.httpStatusCode = 404;
        next(err);
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);
booksRouter.delete("/:asin/comments/:commentId", async (req, res) => {
  try {
    const books = await getBooks();
    const bookIndex = books.findIndex((book) => book.asin === req.params.asin);
    console.log(books[bookIndex].comments)
    if (bookIndex !== -1) {
      // book found
      books[bookIndex].comments = books[bookIndex].comments.filter(
        (comment) => comment.commentId !== req.params.commentId
      );
      await writeBooks(books);
      res.send(books);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = booksRouter;
