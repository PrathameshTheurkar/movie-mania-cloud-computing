import { useState } from "react"
import axios from 'axios'

export const useMovies = () => {
    const [movies, setMovies] = useState([])

    const fetchMovies = async() => {
        const {data} = await axios.get('/admin/movies', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            }
        })
    
        setMovies(data.movies)
    }

    return {
        movies,
        setMovies,
        fetchMovies
    }

}