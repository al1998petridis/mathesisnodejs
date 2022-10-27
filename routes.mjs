import express from 'express';
import * as Validator from './validator/validator.mjs'
import * as UserController from './controller/user_controller.mjs'
import * as BookController from './controller/book_controller.mjs'
import * as CommentController from './controller/comment_controller.mjs'

const router = express.Router()

router.get("/", (req,res) => {
    if (req.session.username)
        res.redirect("/books")
    else
        res.render("home")
})

router.get("/books", UserController.checkIfAuthenticated, BookController.showBookList)

router.get("/addcommentform/:title", UserController.checkIfAuthenticated, CommentController.showComments)

router.post("/doaddcomment/:title",
    UserController.checkIfAuthenticated,
    Validator.validateNewComment,
    CommentController.addComment,
    CommentController.showComments )

router.get("/addbookform", UserController.checkIfAuthenticated, (req, res) => {
    res.render("addbookform")
})

router.post("/books",
    Validator.validateLogin,
    UserController.doLogin,
    BookController.showBookList
)

router.get("/delete/:title", UserController.checkIfAuthenticated,
    BookController.deleteBook,
    BookController.showBookList);

router.get("/deleteComment/:title/", UserController.checkIfAuthenticated,
    CommentController.deleteComment,
    CommentController.showComments);


router.post("/doaddbook",
    UserController.checkIfAuthenticated,
    Validator.validateNewBook,
    BookController.addBook,
    BookController.showBookList
)

router.get("/logout", UserController.doLogout, (req,res) => {
    res.redirect("/")
})

router.get("/register", (req,res) => {
    res.render("registrationform")
})

router.post("/doregister",
    Validator.validateNewUser,
    UserController.doRegister)

export { router }