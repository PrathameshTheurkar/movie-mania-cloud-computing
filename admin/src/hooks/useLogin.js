import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"


export const useLogin = () => {
    const navigate = useNavigate()
    const handleLogin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const {data} = await axios.post('/admin/login', {
            username: formData.get('email'),
            password: formData.get('password')
        })

        if(data.success){
            localStorage.setItem('token', data.token)
            // window.location = '/dashboard'
           toast.success('Successfully Login')
            navigate('/movies')
            return
        }

        toast.error('Incorrect username or password')
    }
    return {
        handleLogin
    }
}
