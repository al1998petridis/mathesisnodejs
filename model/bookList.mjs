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

// // For localhost Postgres database
// const sequelizer = new Sequelize({
//     host: 'localhost',
//     port: 5432,
//     dialect: 'postgres',
//     username: 'postgres',
//     password: 'CloudChamber1936',
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



export { User, Book, BookUser }



