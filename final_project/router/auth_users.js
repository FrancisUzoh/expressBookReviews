const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const secretKey = "access"; 
let users = [{ username: "Francis", password: "123" }];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {

    const { username, password } = req.body;
    const user = users.find((u) => {
        return u.username === username && u.password === password });

    if (user) {

        const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
        if (req.session) {
        req.session.authorization = { token, username: user.username }
        }
        return res.status(200).json({ message: "User successfully logged in", token, username: user.username });

   } else {
        res.status(401).json({ message: "Invalid username or password" });
   }
     
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here

    
    const findUserIsbn = req.params.isbn;

    const makeBookArray = Object.values(books)

    let filter_isbn_users = makeBookArray.filter((i) => {

        return i.ISBN === findUserIsbn
    });

    if (!req.session || !req.session.authorization) {

        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { username } = req.session.authorization;


    if (filter_isbn_users.length === 0) {
     return res.status(404).json({ message: "Book not found" });
     }

    let filter_isbn_user = filter_isbn_users[0];
    let newReviews = req.query.review;

    if (!newReviews) {

    
     return res.status(400).json({ message: "No new Review" });
    }

    // ✅ FIX: Ensure reviews object exists
    if (!filter_isbn_user.reviews) {
        filter_isbn_user.reviews = {};
    }
    // ✅ Add or update review
    const isUpdate = !!filter_isbn_user.reviews[username];
    filter_isbn_user.reviews[username] = newReviews;

    return res.status(200).json({
      Message: "Review",
        reviews: filter_isbn_user.reviews });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {

    const findUserIsbn = req.params.isbn;

    const makeBookArray = Object.values(books)

    let filter_isbn_users = makeBookArray.filter((i) => {

        return i.ISBN === findUserIsbn
    });

    if (!req.session || !req.session.authorization) {

        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { username } = req.session.authorization;


    if (filter_isbn_users.length === 0) {
        return res.status(404).json({ message: "Book not found" });
    }

    let filter_isbn_user = filter_isbn_users[0];

    if (!filter_isbn_user || !filter_isbn_user.reviews || !filter_isbn_user.reviews[username]) {
        return res.status(404).json({ message: "No review found for this user" });
    }

    delete filter_isbn_user.reviews[username];



    return res.status(200).json({
        message: "Please see deleted review below ",
        reviews: filter_isbn_user.reviews
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
