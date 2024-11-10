import { Box, Button, Card, TextField, Typography } from "@mui/material"
import axios from "axios"
import { useState } from "react"
import toast from 'react-hot-toast'


function AddMovie(){
    const [title , setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [imageLink, setImageLink] = useState("")
    const [price, setPrice] = useState(0)
    const [file, setFile] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const formData = new FormData()
        formData.append('image', file)
        formData.append('title', title)
        formData.append('description', description)
        formData.append('price', price)
        formData.append('published', true)
        formData.append('imageLink', imageLink)

        
            const {data} = await axios.post('/admin/movies', formData, {
                headers : {
                    "Content-Type" : "multipart/form-data",
                    "Authorization" : "Bearer "+localStorage.getItem('token')
                }
            })

            if (data.success){
                toast.success('Movie Added Successfully')
            }
    
    }
    
    return <div
    style={{
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
        flexDirection : "column"
    }}
    >
        <Typography
            variant={"h6"}
            >
                Add the Movie
            </Typography>

        <Card
        variant="outlined"
        style={{
            width : "400px",
            padding : "20px",
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
        }}
        >
            <Box component={'form'} noValidate onSubmit={handleSubmit}>
            <TextField
            variant="outlined"
            fullWidth = {true}
            onChange={(e)=>{
                setTitle(e.target.value)
            }}
            label = "Title"
            >
            </TextField>
            <br /> <br />            
            <TextField
            variant="outlined"
            fullWidth = {true}
            onChange={(e)=>{
                setDescription(e.target.value)
            }}
            label = "Description"
            >
            </TextField>
            
            <br /><br />

            <TextField
            variant="outlined"
            fullWidth = {true}
            onChange={(e)=>{
                setPrice(e.target.value)
            }}
            label = "Price"
            >
            </TextField>
            
            <br /><br />

            {/* <TextField
            variant="outlined"
            fullWidth = {true}
            onChange={(e)=>{
                setImageLink(e.target.value)
            }}
            label = "Image Link"
            >
            </TextField> */}

            <input type="file" name="image" id="image" accept="image/*" onChange={(e) => {
                setFile(e.target.files[0])
            }} />

            <br /><br />
            <Button
            type="submit"
            variant="contained"
            size = "large"
            >Add</Button>
            </Box>
        </Card>
    </div>
}

export default AddMovie