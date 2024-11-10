import { Box, Button, Card, TextField } from "@mui/material";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import movieState from "../recoil/atom/movieAtom.js";
import axios from "axios";
import DeleteMovie from "./DeleteMovie.jsx";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

// import { useParams } from "react-router-dom"

function UpdateMovie({ movieId }) {
  const setMovie = useSetRecoilState(movieState);
  const movie = useRecoilValue(movieState);
  const [title, setTitle] = useState(movie.title);
  const [description, setDescription] = useState(movie.description);
  const [image, setImage] = useState(movie.imageLink);
  const [file, setFile] = useState()
  const [price, setPrice] = useState(movie.price)
 
  const handleSubmit = async(e)=>{
    e.preventDefault()
    
    const formData = new FormData()

    formData.append('image', file)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('published', true)
    formData.append('imageLink', image)

    const {data} = await axios.put('/admin/movie/' + movieId, formData, {
        headers: {
            "Content-Type" : "multipart/form-data",
            "Authorization" : "Bearer "+localStorage.getItem('token')
        }
    })

    if (data.success){
        setMovie({
            title : title,
            description : description,
            imageLink : image
        })
        toast.success('Movie Updated Successfully')

    }
}

  return (
    <Card
      variant="outlined"
      style={{
        width: "400px",
        padding: "20px",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}
    >
      <Box component={'form'} noValidate onSubmit={handleSubmit}>
      <TextField
        variant="outlined"
        fullWidth={true}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        label="Title"
        value={title}
      ></TextField>
      <br /> <br />
      <TextField
        variant="outlined"
        fullWidth={true}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        label="Description"
        value={description}
      ></TextField>
      <br />
      <br />

      <TextField
        variant="outlined"
        fullWidth = {true}
        onChange={(e)=>{
            setPrice(e.target.value)
        }}
        label = "Price"
        value = {price}
        >
        </TextField>
        
        <br /><br />

        <input type="file" name="image" id="image" accept="image/*" onChange={(e) => {
                setFile(e.target.files[0])
        }} />

      {/* <TextField
        variant="outlined"
        fullWidth={true}
        onChange={(e) => {
          setImage(e.target.value);
        }}
        label="Image Link"
        value={image}
      ></TextField> */}
      <br />
      <br />
      <Button
        type="submit"
        variant="contained"
        size="large"
      >
        Update
      </Button>
      </Box>
      <DeleteMovie />
    </Card>
  );
}

UpdateMovie.propTypes = {
  movieId: PropTypes.string.isRequired,
};

export default UpdateMovie;
