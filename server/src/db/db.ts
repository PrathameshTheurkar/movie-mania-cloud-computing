import mongoose from 'mongoose'

// Define mongoose Schema 
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    purchasedMovies : [{type : mongoose.Schema.Types.ObjectId , ref : 'Movie'}]
  })
  
  const adminSchema = new mongoose.Schema({
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  })
  
  const movieSchema = new mongoose.Schema({
    title : String ,
    description : String ,
    price : Number,
    imageLink : String,
    published : Boolean
  })
  
  // Define mongoose models
export const User = mongoose.model('User' , userSchema)
export const Admin = mongoose.model('Admin' , adminSchema)
export const Movie = mongoose.model('Movie' , movieSchema)

