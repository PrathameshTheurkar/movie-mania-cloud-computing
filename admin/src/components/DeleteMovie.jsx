import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { useDeleteMovie } from '../hooks/useDeleteMovie';

const DeleteMovie = () => {
    const {deleteMovie} = useDeleteMovie()

    return <>
    <IconButton onClick={deleteMovie}>
    <DeleteIcon />
    </IconButton>
    </>
}

export default DeleteMovie