import {useParams} from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'


export const useDeleteMovie = () => {
    let {movieId} = useParams()
    const navigate = useNavigate()

    const deleteMovie = async() => {
        const {data} = await axios.delete('/admin/movie/' + movieId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })

        if(data.success){
            toast.success('Movie Deleted Successfully')
            navigate('/movies')
        }
    }

    return {
        deleteMovie,
    }


}