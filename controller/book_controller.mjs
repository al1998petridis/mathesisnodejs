import * as BookList from '../model/bookList_model.mjs';

async function showBookList(req, res, next) {
    try {
        const myBooks = await BookList.loadBooks(req.session.username)
        res.render("booklist", {books: myBooks, username:req.session.username}) // also can put username: req.session.username in {}
    } catch (error) {
        next(error)
    }

}

const addBook = async (req,res,next) => {
    try {
        await BookList.addBook({
            "title": req.body["newBookTitle"],
            "author": req.body["newBookAuthor"]
        }, req.session.username)
        next()
    }
    catch (error) {
            next(error)
    }  
}

const deleteBook = async (req, res, next) => {
    try {
        await BookList.deleteBook(req.params.title, req.session.username)
        next()
    } catch (error) {
        next(error)
    }
}

export {showBookList, addBook, deleteBook}