const mongoose = require('mongoose')
const uniqValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
  name: {
    minlength: 3,
    required: true,
    type: String,
  },
  password: {
    minlength: 3,
    required: true,
    type: String,
  },
  username: {
    required: true,
    minlength: 3,
    type: String,
    unique: true,
  },
})

userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.password
  },
})

userSchema.plugin(uniqValidator)

module.exports = mongoose.model('User', userSchema)
