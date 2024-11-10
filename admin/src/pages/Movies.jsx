import { useEffect } from "react"
import { useMovies } from "../hooks/useMovies"
import {Link} from 'react-router-dom'
import { Card, CardActionArea, CardContent, Typography } from "@mui/material"

const Movies = () => {
  const {movies, fetchMovies} = useMovies()

  useEffect(()=>{
    fetchMovies()
  }, [])

    return <div
      style={{
        // height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}
    >
      {movies.map(movie => {
        return <>
       <Link to={`/movie/${movie.movie_id}`}>
       <Card variant="outlined" sx={{ padding: 2, width: 300, height: 300, margin: 3, boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", borderRadius: 3  }}>
      <CardActionArea>
        <img style={{width: '100%', height: 180}} src={movie.imageLink} alt={movie.title + ' image'}/> 
      </CardActionArea>
      <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {movie.description}
          </Typography>
        </CardContent>
    </Card>
       </Link>
        </>
      })}

    </div>
}

export default Movies