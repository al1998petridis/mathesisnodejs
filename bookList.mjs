import { Sequelize, Op, Model, DataTypes } from "sequelize";

// Heroku Postgres database
const sequelizer = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',    
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        logging: false,
        define: {
            timestamps: false
        }
    }
})

// For localhost Postgres database
// const sequelizer = new Sequelize({
//     host: 'localhost',
//     port: 5432,
//     dialect: 'postgres',
//     username: 'alepetpan',
//     password: 'A6949390540a',
//     database: 'myBooks',
//     logging: false,
//     define: {
//         timestamps: false
//     }
// });

const Book = sequelizer.define('Book', {
    title: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

const User = sequelizer.define('User', {
    name: {
        type: DataTypes.TEXT,
        primaryKey: true
    },
    password: {
        type: DataTypes.TEXT
    }
});

const BookUser = sequelizer.define('BookUser', {
    comment: {
        type: DataTypes.TEXT
    }
});

Book.belongsToMany(User, {through: BookUser})
User.belongsToMany(Book, {through: BookUser})

await sequelizer.sync({ alter: true });


class BookList {
    myBooks = { books: [] }

    constructor(username) {
        if (username == undefined)
            throw new Error("Username has not a value")
        this.username = username
    }

    async loadBooks() {
        try {
            await this.findOrAddUser();
            this.myBooks = await this.user.getBooks({ raw: true});
        } catch (error) {
            throw error
        }
    }

    async addBook(newBook) {
        try {
            await this.findOrAddUser();
            let book = await Book.findOne({ where: {title: newBook.title}} )
            console.log(book)
            if (!book) {
                book = await Book.create({
                    title: newBook.title,
                    author: newBook.author
                })
            }
            await this.user.addBook(book)
        } catch (error) {
            throw new Error(error.errors[0].message)
        }
    }

    async deleteBook(book) {
        try {
            await this.findOrAddUser()
            const bookToRemove = await Book.findOne({ where: {title: book.title}} )
            await bookToRemove.removeUser(this.user)
            const numberOfUsers = await bookToRemove.countUsers()
            if (numberOfUsers == 0) {
                Book.destroy({where: {title: book.title}})
            }
        } catch (error) {
            throw error
        }
    }

    async findOrAddUser() {
        if (this.user == undefined)
            try {
                const [user, created] = await User.findOrCreate({ where: {name: this.username}})
                this.user = user
            } catch (error) {
                throw error
            }
    }

    async openDB() {
        return await open( {filename: db_name, driver: sqlite3.Database} )
    }

};

export { BookList }



