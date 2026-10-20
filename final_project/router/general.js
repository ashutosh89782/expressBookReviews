const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
        } else {
            return res.status(400).json({ message: "User already exists!" });
        }
    }
    return res.status(400).json({ message: "Unable to register user: Missing username or password." });
});

// Task 1 & Task 10: Get all books using Promises
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });
    getBooks.then((bookList) => {
        res.status(200).send(JSON.stringify(bookList, null, 4));
    });
});

// Task 2 & Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBook = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    getBook
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(404).json({ message: err }));
});

// Task 3 & Task 12: Get book details based on Author using Promises
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve) => {
        let matchingBooks = [];
        for (let key in books) {
            if (books[key].author === author) {
                matchingBooks.push({
                    isbn: key,
                    title: books[key].title,
                    reviews: books[key].reviews
                });
            }
        }
        resolve(matchingBooks);
    });

    getBooksByAuthor.then((result) => res.status(200).json({ booksbyauthor: result }));
});

// Task 4 & Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve) => {
        let matchingBooks = [];
        for (let key in books) {
            if (books[key].title === title) {
                matchingBooks.push({
                    isbn: key,
                    author: books[key].author,
                    reviews: books[key].reviews
                });
            }
        }
        resolve(matchingBooks);
    });

    getBooksByTitle.then((result) => res.status(200).json({ booksbytitle: result }));
});

// Task 5: Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
