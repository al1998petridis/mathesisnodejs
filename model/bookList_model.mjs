import {Book, User, BookUser} from './bookList.mjs'
import bcrypt from 'bcrypt'
import { where } from 'sequelize'

async function addUser(username, password) {
    try {
        if (!username || !password)
            throw new Error("Username or password is missing")
        
        let user = await User.findOne({where: {name: username}})

        if (user)
            throw new Error("There is already a user with username " + username)
        
        const hash = await bcrypt.hash(password, 10)
        user = await User.create({name: username, password:hash})
        return user 
    } catch (error) {
        throw error
    }
}

async function login(username, password) {
    try {
        if (!username || !password)
            throw new Error("Username or password is missing")
        
        let user = await User.findOne({where: {name: username}})

        if (!user)
            throw new Error("There is not a user with username " + username)
        
        const match = await bcrypt.compare(password, user.password)
        if (match)
            return user 
        else
            throw new Error("Wrong credentials")
    } catch (error) {
        throw error
    }
}

async function loadBooks(username) {
    try {
        if (!username)
            throw new Error("Username must be provided")
        
        const user = await User.findOne({where: {name: username}});
        if (!user)
            throw new Error("Unknown user")
        
        const myBooks = await user.getBooks({raw: true});
        return myBooks
    } catch (error) {
        throw error
    }
}

async function addBook(newBook, username) {
    try {
        if (!username)
            throw new Error("Username must be provided")
        
        const user = await User.findOne({where: {name:username}});

        if (!user)
            throw new Error("Unknown user")

        let book = await Book.findOne({where: {title: newBook.title}})
        if (!book) {
            book = await Book.create({
                title: newBook.title,
                author: newBook.author
            })
        }
        await user.addBook(book)
    } catch (error) {
        throw error
    }
}

async function addComment(book, comment, username) {
    try {
        if (!username)
            throw new Error("Username must be provided")
        
        const user = await User.findOne({where: {name:username}});

        if (!user)
            throw new Error("Unknown user")

        await BookUser.update({comment: comment},{
            where: {
                BookTitle: book.title,
                UserName: username
            }
        })
    } catch (error) {
        throw error
    }
}

async function loadBook(BookTitle, username) {
    try {
        if (!username)
            throw new Error("Username must be provided")
        
        const user = await User.findOne({where: {name: username}});
        if (!user)
            throw new Error("Unknown user")
        
        const book = await Book.findOne({where: {title: BookTitle}})
        return book
    } catch (error) {
        throw error
    }
}

async function loadComments(BookTitle, username) {
    try {
        if (!username)
            throw new Error("Username must be provided")
        
        const user = await User.findOne({where: {name: username}});
        if (!user)
            throw new Error("Unknown user")
        
        const bookComments = await BookUser.findAll({where: {BookTitle: BookTitle}, raw: true})
        return bookComments
    } catch (error) {
        throw error
    }
}

async function deleteBook(title, username) {

    try {
        const user = await User.findOne({ where: {name: username} })
        const bookToRemove = await Book.findOne({ where: { title: title } })
        await bookToRemove.removeUser(user)
        const numberOfUsers = await bookToRemove.countUsers()
        if (numberOfUsers == 0) {
            Book.destroy({ where: { title: title } })
        }
    } catch (error) {
        throw error
    }
}

async function deleteComment(title, username) {
    try {
        await BookUser.update({comment: null},{
            where: {
                BookTitle: title,
                UserName: username
            }
        })
    } catch (error) {
        throw error
    }
}


async function openDB() {
    return await open({ filename: db_name, driver: sqlite3.Database })
}

export { addUser, login, loadBooks, addBook, deleteBook, addComment, loadComments, loadBook, deleteComment}