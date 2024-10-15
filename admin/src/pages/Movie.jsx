import { useEffect } from "react"
import { useMovie } from "../hooks/useMovie"
import MovieCard from "../components/MovieCard"
import UpdateMovie from "../components/UpdateMovie"
import { useParams } from "react-router-dom"
import { Box } from "@mui/material"


const Movie = () => {
    const {fetchMovie, success, msg} = useMovie()
    let {movieId} = useParams()
    

    useEffect(()=>{
        fetchMovie()
    }, [])

    if(!success){
        if(msg == "Invalid movieId"){
            return <div>
                Invalid movieId
            </div>
        }
        return <div>
            Loading......
        </div>
    }

    return <>
    <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: {sm: 'row', xs: 'column'}}}>
    <MovieCard />
    <UpdateMovie movieId={movieId}/>
    </Box>
    </>
}

export default Movie