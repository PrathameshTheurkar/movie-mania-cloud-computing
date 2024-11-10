import express, {Request, Response} from 'express'
import {generateTokenAdmin, authenticateJWTAdmin} from '../middleware/admin'
import {z} from 'zod'
import {db} from '../index'
import multer from 'multer'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'

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



const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

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

    const findAdminQuery = `SELECT * FROM admins WHERE username = ? AND password = ?`

    db.query(findAdminQuery, [username, password], (err, result) => {
      if(err) {
        return res.status(500).json({
          msg: err
        })
      }

      if(result.length > 0){
        return res.status(403).json({
          success: false,
          msg: 'Admin already exists'
        })
      }
      const insertAdminQuery = `INSERT INTO admins (firstName, lastName, username, password) VALUES (?, ?, ?, ?)`

      db.query(insertAdminQuery, [firstName, lastName, username, password], (err, result) => {
        if(err) {
          return res.status(500).json({
            msg: err
          })
        }

        const token = generateTokenAdmin(req.body)
        res.status(200).json({
          success: true,
          msg: 'Admin created successfully',
          token
        })
      })

    })

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

    const findAdminQuery = `SELECT * FROM admins WHERE username = ? AND password = ?`
    db.query(findAdminQuery, [username, password], (err, result) => {
      if(err) {
        return res.status(500).json({
          msg: err
        })
      }

      if(result.length === 0){
        return res.status(403).json({
          success: false,
          msg: 'Admin not found'
        })
      }

      const token = generateTokenAdmin(req.body)
      res.status(200).json({
        success: true,
        msg: 'Admin logged in successfully',
        token
      })
    })

  });
  
  router.get('/me' , authenticateJWTAdmin , (req: AuthenticatedRequest, res: Response)=>{
    res.json({
      auth : true,
      user : req.headers.user  })
  })
  
  router.post('/movies', authenticateJWTAdmin , upload.single('image'), async (req: Request, res: Response) => {
    // logic to create a movie
    const bucketName = process.env.BUCKET_NAME || ''
    const bucketRegion = process.env.REGION || ''
    const accessKeyId = process.env.ACCESS_KEY || ''
    const secretAccessKey = process.env.SECRET_ACCESS_KEY || ''
    
    const s3 = new S3Client({
      region: bucketRegion,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      }
    })
    let movie = req.body;

    const generatedImageName = randomImageName()
    
   const findMovieQuery = `SELECT * FROM movies WHERE title = ? AND description = ? AND price = ? AND imageLink = ? AND published = ?`

   db.query(findMovieQuery, [movie.title, movie.description, Number(movie.price), movie.imageLink, movie.published], async (err, result) => {
    if(err) {
      return res.status(500).json({
        msg: err
      })
    }

    if(result.length > 0){
      return res.status(403).json({
        success: false,
        msg: 'Movie already exists'
      })
    }

    const params = {
      Bucket: bucketName,
      Key: generatedImageName,
      Body: req.file?.buffer,
      ContentType: req.file?.mimetype,
    }

    const command = new PutObjectCommand(params)

    await s3.send(command)

   
    const cloundfrontImageLink = 'https://d244xuri15jv8k.cloudfront.net/' + generatedImageName

    const insertMovieQuery = `INSERT INTO movies (title, description, price, imageLink, published, imageName) VALUES (?, ?, ?, ?, ?, ?)`
    db.query(insertMovieQuery, [movie.title, movie.description, Number(movie.price), cloundfrontImageLink, true, generatedImageName], (err, result) => {
      if(err) {
        return res.status(500).json({
          msg: err
        })
      }

      res.status(200).json({
        success: true,
        msg: 'Movie created successfully'
      })
    })
   })
  
  });
  
  router.put('/movie/:movieId' , authenticateJWTAdmin, upload.single('image'), async (req: Request, res: Response) => {
    // logic to update a movie

    const bucketName = process.env.BUCKET_NAME || ''
    const bucketRegion = process.env.REGION || ''
    const accessKeyId = process.env.ACCESS_KEY || ''
    const secretAccessKey = process.env.SECRET_ACCESS_KEY || ''
    
    const s3 = new S3Client({
      region: bucketRegion,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      }
    })

    let generatedImageName = randomImageName()

    // res.status(200).json({
    //   body: req.body,
    //   file: req.file
    // })
    const findMovieQuery = `SELECT * FROM movies WHERE movie_id = ?`
    db.query(findMovieQuery, [req.params.movieId], async (err, result) => {
      if(err) {
        return res.status(500).json({
          msg: err
        })
      }

      if(result.length === 0){
        return res.status(403).json({
          success: false,
          msg: 'Movie does not exist'
        })
      }

      
      let cloundfrontImageLink = ''
      if(req.file !== undefined) {
        // if image is undefined or not, if it is not undefined then
        // delete the old image from s3 and upload the new image to s3 and get the cloudfront link of the new image 
        

    const params = {
      Bucket: bucketName,
      Key: result[0].imageName
    }

    const deleteCommand = new DeleteObjectCommand(params)

    await s3.send(deleteCommand)

    const newParams = {
      Bucket: bucketName,
      Key: generatedImageName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }

    const newCommand = new PutObjectCommand(newParams)

    await s3.send(newCommand)

     cloundfrontImageLink = 'https://d244xuri15jv8k.cloudfront.net/' + generatedImageName
        
      }else {
        cloundfrontImageLink = result[0].imageLink
        generatedImageName = result[0].imageName
      }
      
      const updateMovieQuery = `UPDATE movies SET title = ?, description = ?, price = ?, imageLink = ?, published = ?, imageName = ? WHERE movie_id = ?`

      db.query(updateMovieQuery, [req.body.title, req.body.description, req.body.price, cloundfrontImageLink, true, generatedImageName, req.params.movieId], (err, result) => {
        if(err) {
          return res.status(500).json({
            msg: err
          })
        }

        res.status(200).json({
          success: true,
          msg: 'Movie updated successfully'
        })
      })


    })
  });
  
  router.get('/movie/:movieId', authenticateJWTAdmin ,async (req: Request, res: Response)=>{
    // logic to get one movie by movieId
    
    const findMovieQuery = `SELECT * FROM movies WHERE movie_id = ?`
    db.query(findMovieQuery, [req.params.movieId], (err, result) => {
      if(err) {
        return res.status(500).json({
          msg: err
        })
      }

      if(result.length == 0) {
        return res.status(403).json({
          success: false,
          msg: 'Movie does not exist'
        })
      }

      res.status(200).json({
        success: true,
        msg: 'Movie fetched successfully',
        movie: result[0]
      })
    })
  })
  
  router.get('/movies', authenticateJWTAdmin ,async (req: Request, res: Response) => {
    // logic to get all movies

    const getMoviesQuery = `SELECT * FROM movies`
    db.query(getMoviesQuery, (err, result) => {
      if(err) {
        return res.status(500).json({
          msg: err
        })
      }

      res.status(200).json({
        success: true,
        msg: 'Movies fetched successfully',
        movies: result
      })
    })
  });

  router.delete('/movie/:movieId', authenticateJWTAdmin, async(req: Request, res: Response)=>{
    const {movieId} = req.params

    const bucketName = process.env.BUCKET_NAME || ''
    const bucketRegion = process.env.REGION || ''
    const accessKeyId = process.env.ACCESS_KEY || ''
    const secretAccessKey = process.env.SECRET_ACCESS_KEY || ''
    
    const s3 = new S3Client({
      region: bucketRegion,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      }
    })

    
    const findMovieQuery = `SELECT * FROM movies WHERE movie_id = ?`

    db.query(findMovieQuery, [movieId], async(err, result) => {
      if(err) {
        return res.status(500).json({
          msg: err
        })
      }

      if(result.length === 0){
        return res.status(403).json({
          success: false,
          msg: 'Movie does not exist'
        })
      }

      const params = {
        Bucket: bucketName,
        Key: result[0].imageName
      }
  
      const deleteCommand = new DeleteObjectCommand(params)
  
      await s3.send(deleteCommand)

      const deleteMovieQuery = `DELETE FROM movies WHERE movie_id = ?`
      db.query(deleteMovieQuery, [movieId], (err, result) => {
        if(err) {
          return res.status(500).json({
            msg: err
          })
        }

        res.status(200).json({
          success: true,
          msg: 'Movie deleted successfully'
        })
      })
    })
  })


export default router