import express from 'express';
import { BookList } from './bookList.mjs';
import { body, validationResult } from 'express-validator';

const router = express.Router()

router.get("/", (req,res) => {
    res.render("home")
})

router.get("/books",
            checkIfAuthenticated,
            showBookList)

router.post("/books", 
            (req,res, next) => {
                req.session.username = req.body['username']
                next()
            },
            showBookList
)

router.get("/addbookform",
            checkIfAuthenticated,
            (req,res) => {
                res.render("addbookform")
            })

router.post("/doaddbook",
            checkIfAuthenticated,
            body("newBookTitle")
            .isLength({ min:5 })
            .withMessage("Title must be at least 5 characters long."),
            async (req,res,next) => {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    const newBook = {
                        "title": req.body["newBookTitle"],
                        "author": req.body["newBookAuthor"]
                    }
                    try {
                        const bookList = new BookList(req.session.username)
                        await bookList.addBook(newBook)
                    } catch (error) {
                        next(error)
                    }
                    res.redirect("/books")
                } else {
                    res.render("addbookform", {
                        message: errors.mapped(),
                        title: req.body["newBookTitle"],
                        author: req.body["newBookAuthor"]})
                }  
            })

router.get("/logout",
            checkIfAuthenticated,
            (req,res) => {
                req.session.destroy()
                res.redirect("/")
            })

async function showBookList(req, res, next) {
    res.locals.username = req.session.username 
    try {
        const bookList = new BookList(req.session.username)
        await bookList.loadBooks()
        res.render("booklist", {books: bookList.myBooks}) // also can put username: req.session.username in {}
    } catch (error) {
        next(error)
    }

}

function checkIfAuthenticated(req,res,next) {
    if (req.session.username)
        next()
    else
        res.redirect("/")
}

export { router }