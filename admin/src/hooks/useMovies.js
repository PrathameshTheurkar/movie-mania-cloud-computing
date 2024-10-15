import { useState } from "react"
import axios from 'axios'

export const useMovies = () => {
    const [movies, setMovies] = useState([])

    const fetchMovies = async() => {
        const {data} = await axios.get('http://localhost:4000/admin/movies', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            }
        })
    
        setMovies(data)
    }

    return {
        movies,
        setMovies,
        fetchMovies
    }

}