import * as BookList from '../model/bookList_model.mjs';

async function showComments(req, res, next) {
    try {
        const bookComments = await BookList.loadComments(req.params.title, req.session.username)
        const book = await BookList.loadBook(req.params.title, req.session.username)
        res.render("addcommentform", {comments: bookComments, book:book})
    } catch (error) {
        next(error)
    }
}

const addComment = async (req,res,next) => {
    try {
        await BookList.addComment( { "title": req.body["newBookTitle"], "author": req.body["newBookAuthor"] },
        req.body["newBookComment"], req.session.username)
        next()
    }
    catch (error) {
        next(error)
    }  
}

const deleteComment = async (req,res,next) => {
    try {
        await BookList.deleteComment(req.params.title, req.session.username)
        next()
    }
    catch (error) {
        next(error)
    }  
}

export {showComments, addComment, deleteComment}