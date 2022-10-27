import * as BookList from '../model/bookList_model.mjs';

const doLogin = async (req, res, next) => {
    try {
        const user = await BookList.login(req.body.username, req.body.password)
        if (user) {
            req.session.username = req.body.username
            req.session.password = req.body.password
            next()            
        }
        else
            throw new Error("Unknown Error")
    } catch (error) {
        next(error)
    }
}

const doRegister = async (req,res,next) => {
    const username = req.body.username
    const password = req.body.password
    try {
        const user = await BookList.addUser(username, password)
        if (user) {
            res.render("home", {newusermessage: "User registration success"})     
        }
        else {
            throw new Error("Unknown error in user registration")
        }
    } catch (error) {
        next(error)
    }
}

const doLogout = async (req, res, next) => {
    req.session.destroy()
    next()
}

function checkIfAuthenticated(req, res, next) {
    if (req.session.username) {
        res.locals.username = req.session.username
        next()
    }
    else
        res.redirect("/")
}

export {checkIfAuthenticated, doLogin, doRegister, doLogout}