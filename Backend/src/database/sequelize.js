const Sequelize = require('sequelize')
const UserModel = require('./models/user')
const NoteModel = require('./models/note')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  port: 8889,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const User = UserModel(sequelize, Sequelize)
const Note = NoteModel(sequelize, Sequelize)

Note.belongsTo(User)
User.hasMany(Note)

module.exports = {
  User,
  Note,
}