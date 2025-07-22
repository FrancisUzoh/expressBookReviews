const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here   
    const { username, password } = req.body;
    //Function to check if the user exists

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const userExist = users.find((user) => {

        return user.username === username
    });

    if (userExist) {
        return res.status(409).json({ message: "User already exists!" });

    }
   
    users.push({ username, password });

   
    return res.status(201).json({
        message: "User successfully registered. Now you can login." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
    let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books)
        }, 6000)
    })
    //Console log before calling the promise
    console.log("Before calling promise");
    //Call the promise and wait for it to be resolved and then print a message.
    myPromise.then((allBooks) => {
        return res.status(200).json({
            message: "print list of books: ",
            books: allBooks
        });
    })
    //Console log after calling the promise
    console.log("After calling promise");

});
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
        const isbn = req.params.isbn;
        // Find the book by ISBN
        const book = Object.values(books).find(b => b.ISBN === isbn);
        let myPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (book) {
                    resolve(book);
                } else {
                    reject("Book not found");
                }
            }, 6000);
        });
                console.log("Before calling promise");

        myPromise.then((foundBook) => {
            return res.status(200).json({
                message: "Book found:",
                book: foundBook
            });
        }).catch((err) => {
            return res.status(404).json({
                message: err
            });
        });

        console.log("After calling promise");
    });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here

    const authorLone = req.params.author.toLowerCase();

    const findAuthor = Object.values(books).filter((a) => {

        return a.author.toLowerCase()===authorLone;
    });
    if (findAuthor.length > 0) {
        return res.status(200).json({
            Message: `Author Name ${authorLone}`,
            findAuthor: findAuthor
        });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const titleParam = req.params.title.toLowerCase();

    const booksByTitle = Object.values(books).filter((book) => {
        return book.title.toLowerCase() === titleParam;
    });

    if (booksByTitle.length > 0) {
        return res.status(200).json({
            Message: `Books with title"${req.params.title}"`,
            books: booksByTitle
        });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const reviewIsbn = req.params.isbn;

    const findReview = Object.values(books).find((i) => {

        return i.ISBN === reviewIsbn     
    });
    if (findReview) {
        return res.status(200).json({
            Message: "Review",
            reviews: findReview.reviews
        });
    } else {
        return res.status(404).json({ message: "Review not found" });
    }
});

module.exports.general = public_users;
