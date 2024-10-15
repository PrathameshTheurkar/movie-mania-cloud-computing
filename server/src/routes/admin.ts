import express, {Request, Response} from 'express'
import mongoose from 'mongoose'
import {Admin, Movie} from "../db/db"
import {generateTokenAdmin, authenticateJWTAdmin} from '../middleware/admin'
import {z} from 'zod'

const router = express.Router()

interface AuthenticatedRequest extends Request {
  user?: {
    username: string
  }
}

const newUserSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(6).max(20),
  firstName: z.string().min(2).max(20),
  lastName: z.string().min(2).max(20)
})

const userSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(6).max(20),
})

// Admin routes
router.post('/signup', async (req: Request, res: Response) => {
    // logic to sign up admin

    const parsedInput = newUserSchema.safeParse(req.body)
    if(!parsedInput.success){
      return res.status(411).json({
        msg: parsedInput.error
      })
    }
    const {username, password, firstName, lastName} = parsedInput.data

    const admin = await Admin.findOne({username, password})
    if(admin){
      res.status(403).json({success : false,massage : 'Admin already exits'});
    }else{
      const newAdmin = new Admin({firstName, lastName, username , password})
      await newAdmin.save()
      const token = generateTokenAdmin(req.body)
      res.json({ success : true, message: 'Admin created successfully'  , token : token});
    //   res.cookie("token", token, {expire : 24 * 60 * 60 * 1000 }).json({ success : true,message: 'Admin created successfully'  , token1 : token});
    }
  });
  
  router.post('/login', async (req: Request, res: Response) => {
    // logic to log in admin
    const parsedInput = userSchema.safeParse(req.body)
    if(!parsedInput.success){
      return res.status(411).json({
        msg: parsedInput.error
      })
    }
    const {username, password} = parsedInput.data

    const admin = await Admin.findOne({username , password})
  
    if(admin){
      const token = generateTokenAdmin(admin)
      res.json({success : true, message : 'Login Successfully' , token1 : token})
    //   res.cookie("token", token, {expire : 24 * 60 * 60 * 1000 }).json({success : true, message : 'Login Successfully' , token1 : token})
    }else{
     res.json({success : false ,message : 'Admin Authentication failed'})
    }
  });
  
  router.get('/me' , authenticateJWTAdmin , (req: AuthenticatedRequest, res: Response)=>{
    res.json({
      auth : true,
      user : req.headers.user  })
  })
  
  router.post('/movies', authenticateJWTAdmin , async (req: Request, res: Response) => {
    // logic to create a movie
    let movie = req.body;
    
    const newMovie = new Movie(movie)
      const checkMovieExist = await Movie.findOne({title : newMovie.title , description : newMovie.description , price  : newMovie.price , imageLink : newMovie.imageLink , published : newMovie.published})
      if(checkMovieExist){
        res.json({success : false,message : "Movie already created"})
      }else{
        await newMovie.save()
        res.json({success : true , message : "Movie created successfully" , movieId : newMovie._id.toString()})
      }
  
    // }
  });
  
  router.put('/movie/:movieId' , authenticateJWTAdmin,async (req: Request, res: Response) => {
    // logic to update a movie
    const isValid = mongoose.Types.ObjectId.isValid(req.params.movieId)
    if(!isValid){
      return res.status(403).json({success: false, message: "Invalid movieId"})
    }
    const movie =await Movie.findByIdAndUpdate(req.params.movieId , req.body , {new : true})
    if(movie){
      res.json({success: true, message : "Movie Updated Successfully"});  
    }else{
      res.status(403).json({success: false, message : "Movie doesn't exits"})
    }
  });
  
  router.get('/movie/:movieId', authenticateJWTAdmin ,async (req: Request, res: Response)=>{
    // logic to get one movie by movieId
    const isValid = mongoose.Types.ObjectId.isValid(req.params.movieId)
    if(!isValid){
      return res.status(403).json({success: false, message: "Invalid movieId"})
    }
  
    const movie = await Movie.findById(req.params.movieId)
    if (movie){
      res.status(200).json({success: true, message : "Movie fetched successfully", movie})
    }else{
      res.status(403).json({success:false , message : "Movie doesn't exits!!"})
    }
  })
  
  router.get('/movies', authenticateJWTAdmin ,async (req: Request, res: Response) => {
    // logic to get all movies
    const movies = await Movie.find({})
    res.json(movies);
  });

  router.delete('/movie/:movieId', authenticateJWTAdmin, async(req: Request, res: Response)=>{
    const {movieId} = req.params
    const movieExist = await Movie.findById(movieId)

    if(movieExist){
      const movie = await Movie.findByIdAndDelete(movieId)
      res.status(200).json({success: true, msg: 'Movie Deleted Successfully', movie})
    }else{
      res.json({success: false, msg: 'Movie does not exist'})
    }
  })


export default router