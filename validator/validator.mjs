import { body, validationResult } from 'express-validator';
import { Book, BookUser } from '../model/bookList.mjs';

const validateLogin = [
    body("username")
        .trim().escape().isLength({min:4})
        .withMessage("Give name with at least 4 characters"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty())
            next()
        else
            res.render("home", {message: errors.mapped()})
    }
]

const validateNewBook = [
    body("newBookTitle")
        .trim().escape()
        .isLength({min:3})
        .withMessage("At least 3 letters"),
    body("newBookAuthor")
        .trim().escape()
        .isLength({min:5})
        .withMessage("At least 5 letters"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            res.render("addbookform", {
                message: errors.mapped(),
                title: req.body["newBookTitle"],
                author: req.body["newBookAuthor"]
            })
        }
        else {
            next()
        }
    }
]

const validateNewUser = [
    body("username")
        .trim().escape().isLength({min:4})
        .withMessage("Give name with at least 4 characters"),
    body("password-confirm")
        .trim()
        .isLength({min:4, max:10})
        .withMessage("Password must be from 4 to 10 characters")
        .custom((value, { req }) => {
            if (value != req.body.password)
                throw new Error("Passwords must match")
            else
                return true
        }),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                res.render("registrationform", {
                    message: errors.mapped(),
                    name: req.body.username
            })
            else
                next()
        }
]

const validateNewComment = [
    body("newBookComment")
        .trim().escape()
        .isLength({min:5})
        .withMessage("At least 5 letters"),
    async (req, res, next) => {
        const errors = validationResult(req)
        const comments = await BookUser.findAll({where: {
            BookTitle: req.body["newBookTitle"]
        }})
        const book = await Book.findOne({where: {
            title: req.body["newBookTitle"]
        }})
        if (!errors.isEmpty()){
            res.render("addcommentform", {  
                message: errors.mapped(),
                comments: comments,
                book: book,
                newBookComment: req.body["newBookComment"],
            })
        }
        else {
            next()
        }
    }
]

export {validateLogin, validateNewBook, validateNewUser, validateNewComment}