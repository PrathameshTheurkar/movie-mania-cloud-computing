import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { User, Movie } from "../db/db";
import {
  generateTokenUser,
  authenticateJWTUser,
} from "../middleware/user";
import {z} from 'zod'

const router = express.Router();

interface User{
  username?: string | ''
}

interface AuthenticatedRequest extends Request {
  user?: User 
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

// Zod inference
// type userSchemaType = z.infer<typeof userSchema>

// User routes
router.post("/signup", async (req: Request, res: Response) => {
  // logic to sign up user
  const parsedInput = newUserSchema.safeParse(req.body);
  if(!parsedInput.success){
    return res.status(411).json({
      msg: parsedInput.error
    })
  }
  let {username, password, firstName, lastName} = parsedInput.data

  const existingUser = await User.findOne({ username, password });

  if (existingUser) {
    res.json({ success: false, message: "User already signed up" });
  } else {
    const newUser = new User({
      firstName,
      lastName,
      username,
      password,
      purchasedMovies: [],
    });
    await newUser.save();
    const token = generateTokenUser(req.body);

    // res.status(200).cookie("token", token, {expire : 24 * 60 * 60 * 1000}).json({message : "User created successfully" , token})
    res
      .status(200)
      .json({ success: true, message: "User created successfully", token });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  // logic to log in user
  const parsedInput = userSchema.safeParse(req.body);
  if(!parsedInput.success){
    return res.status(411).json({
      msg: parsedInput.error
    })
  }
  const {username, password} = parsedInput.data
  
  const user1 = await User.findOne({ username, password });
  if (user1) {
    const token = generateTokenUser(user1);
    // res.cookie("token", token, {expire : 24 * 60 * 60 * 1000}).json({message : "Login Succesfully" , token1 : token})
    res
      .status(200)
      .json({ success: true, message: "Login Succesfully", token });
  } else {
    res.json({ success: false, message: "User not found" });
  }
});

router.get("/me", authenticateJWTUser, async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    user: req.headers.user,
    auth: true,
  });
});

router.get("/movies", authenticateJWTUser, async (req: Request, res: Response) => {
  // logic to list all movies
  const movies = await Movie.find();
  res.json({ success: true, movies: movies });
});

router.get("/movie/:movieId", authenticateJWTUser, async (req: Request, res: Response) => {
  //logic to get a single movie

  const movieId = req.params.movieId;

  const movie = await Movie.findById(movieId);
  if (movie) {
    res.status(200).json({ success: true, msg: "Movie founded", movie });
  } else {
    res.status(404).json({ success: false, msg: "Movie not found" });
  }
});

router.post("/movies/:movieId", authenticateJWTUser, async (req: AuthenticatedRequest, res: Response) => {
  // logic to purchase a movie
  const isValid = mongoose.Types.ObjectId.isValid(req.params.movieId);
  if (!isValid) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid movieId" });
  }
  const movie = await Movie.findById(req.params.movieId);
  if (movie) {
    const user = await User.findOne({ username: req.headers.user });
    if (user) {
      const isPurchased = user.purchasedMovies.find(
        (co) => co._id.toString() == req.params.movieId
      );

      if (isPurchased) {
        res.json({ success: true, message: "Movie already purchased" });
      } else {
        user.purchasedMovies.push(movie._id);
        await user.save();
        res.json({ success: true, message: "Movie purchased" });
      }
    } else {
      res.status(403).json({ success: false, message: "User doesn't exist" });
    }
  } else {
    res.status(404).json({ success: false, message: "Movie doesn't exist" });
  }
});

router.get("/purchasedMovies", authenticateJWTUser, async (req: AuthenticatedRequest, res: Response) => {
  // logic to view purchased movies
  const user = await User.findOne({ username: req.headers.user }).populate(
    "purchasedMovies"
  );
  if (user) {
    res.json({ success: true, purchasedMovies: user.purchasedMovies || [] });
  } else {
    res.status(403).json({ success: false, message: "User not found" });
  }
});

export default router