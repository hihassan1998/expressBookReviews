const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Customer successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "Customer with same username already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register customer."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Extract ISBN from request parameters
    const book = books[isbn]; // Retrieve book details based on ISBN
  
    if (book) {
      return res.status(200).json({ book }); // Return book details if found
    } else {
      return res.status(404).json({ message: "Book not found" }); // Return error if book is not found
    }
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author; // Extract author from request parameters
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
    if (booksByAuthor.length > 0) {
      return res.status(200).json({ books: booksByAuthor }); // Return books if found for the author
    } else {
      return res.status(404).json({ message: "Books by this author not found" }); // Return error if books are not found for the author
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title; // Extract author from request parameters
    const booksBytitle = Object.values(books).filter(book => book.title === title);
  
    if (booksBytitle.length > 0) {
      return res.status(200).json({ books: booksBytitle }); // Return books if found for the author
    } else {
      return res.status(404).json({ message: "Books by this title not found" }); // Return error if books are not found for the author
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Extract ISBN from request parameters
    const book = books[isbn]; // Retrieve book details based on ISBN
  
    if (book) {
      return res.status(200).json({ book }); // Return Review details if found
    } else {
      return res.status(404).json({ message: "Review not found" }); // Return error if book is not found
    }
  });
// TASK # 10  Getting the list of books available in the shop
public_users.get('/async-get-books', async function (req, res) {
    try {
      const bookList = JSON.stringify({ books }, null, 4);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate asynchronous operation
      return res.status(200).json({ books: bookList });
    } catch (error) {
      return res.status(404).json({ message: `Book list not found` });
    }
  });
  

//TASK 11 Getting the book details based on Author available in the shop
public_users.get('/async-get-isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        return res.status(200).json({ book });
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    }, 1000); // Simulate asynchronous operation
  });
 
//TASK 12  Getting the book details based on Author
public_users.get('/async-get-author/:author', async function(req,res){
    const author = req.params.author; // Extract author from request parameters
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
    if (booksByAuthor.length > 0) {
      return res.status(200).json({ books: booksByAuthor }); // Return books if found for the author
    } else {
      return res.status(404).json({ message: "Books by this author not found" }); // Return error if books are not found for the author
    }
});
//TASK 13 Getting the book details based on Title





//TASK 13 Getting the book details based on Title available in the shop
module.exports.general = public_users;
 