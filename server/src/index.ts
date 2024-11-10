import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import adminRouter from './routes/admin'
import userRouter from './routes/user'
import dotenv from 'dotenv'
import path from 'path'
import mysql from 'mysql'

const app = express();
dotenv.config({
  path: path.join(__dirname, '../.env')
})
app.use(express.json());

const buildPath = path.join(__dirname, '../../admin/dist')

app.use(express.static(buildPath))

app.use(cors())
app.use(cookieParser())

app.use('/admin', adminRouter)
app.use('/users', userRouter)


export const db = mysql.createConnection({
  host: process.env.RDS_HOST || '',
  user: process.env.RDS_USER || '',
  password: process.env.RDS_PASSWORD || '',
  database: process.env.RDS_DATABASE || ''
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  // console.log('Connected to MySQL as ID ' + db.threadId);
  createTables()
});

const createTables = () => {
  const createUsersTableQuery = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
`

db.query(createUsersTableQuery, (error, results) => {
  if (error) {
    console.error('Error creating users table:', error);
    return;
  }
  // console.log('Created users table:', results);
});

const createAdminsTableQuery = `CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
`

db.query(createAdminsTableQuery, (error, results) => {
  if (error) {
    console.error('Error creating admins table:', error);
    return;
  }
  // console.log('Created admins table:', results);
});


const createMoviesTableQuery = `CREATE TABLE IF NOT EXISTS movies (
  movie_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  imageLink VARCHAR(255),
  published BOOLEAN,
  imageName VARCHAR(255)
);`

db.query(createMoviesTableQuery, (error, results) => {
  if (error) {
    console.error('Error creating movies table:', error);
    return;
  }
  // console.log('Created movies table:', results);
});

const createPurchasedMoviesTableQuery = `CREATE TABLE IF NOT EXISTS purchased_movies (
  user_id INT,
  movie_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
  PRIMARY KEY (user_id, movie_id)
);`

db.query(createPurchasedMoviesTableQuery, (error, results) => {
  if (error) {
    console.error('Error creating purchased_Movies table:', error);
    return;
  }
  // console.log('Created purchased_movies table:', results);
});

}

app.get('/home', (req, res) => {
 res.json({msg: 'Welcome Home'})      
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../admin/dist', 'index.html'), (err) => {
    if(err)res.status(500).send(err)
  })
})
app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});

