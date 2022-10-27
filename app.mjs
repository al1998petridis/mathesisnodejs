import 'dotenv/config'
import express from 'express';
import { engine } from 'express-handlebars';
import { router } from './routes.mjs';
import session, { Store } from 'express-session';
import createMemoryStore from 'memorystore';

import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

const MemoryStore = createMemoryStore(session);

const myBookSession = session({
    secret: process.env.SESSION_SECRET,
    store: new MemoryStore({ checkPeriod: 86400*1000 }),
    resave: false,
    saveUninitialized: false,
    name: "myBooks-sid",
    cookie: {
        maxAge: 1000*60*20,
    }
})

const app = express()

app.use(myBookSession)
app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))

app.engine('hbs', engine({
    extname: ".hbs",
    handlebars:allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        ifCond: function(v1, v2, options) {
            if(v1 !== v2) {
            return options.fn(this);
            }
            return options.inverse(this);
        },
        ifSet: function(comments, username, options) {
            for (const comment in comments) 
                if (comments[comment].comment !== null && comments[comment].UserName === username)
                    return options.fn(this);
            return options.inverse(this);
        },
        ifallOtherCommentsNull: function(comments, username, options) {
            for (const comment in comments) 
                if (comments[comment].comment !== null && comments[comment].UserName !== username)
                    return options.inverse(this);
            return options.fn(this);
        }
    }   
}))

app.set('view engine', 'hbs')

app.use("/", router)

app.use((req,res) => {
    res.redirect("/")
})

app.use((err,req,res,next) => {
    console.log(err.message)
    console.log(err.stack)
    res.render("error", {message: err.message})
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log("Application has started at port " + port))
