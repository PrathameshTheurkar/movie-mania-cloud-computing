import { Button, Card, TextField } from "@mui/material";
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

  return (
    <Card
      variant="outlined"
      style={{
        width: "400px",
        padding: "20px",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}
    >
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
        fullWidth={true}
        onChange={(e) => {
          setImage(e.target.value);
        }}
        label="Image Link"
        value={image}
      ></TextField>
      <br />
      <br />
      <Button
        variant="contained"
        size="large"
        onClick={async () => {
          const { data } = await axios.put(
            "http://localhost:4000/admin/movie/" + movieId,
            {
              title,
              description,
              price: 100,
              imageLink: image,
              published: true,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );

          if (data.success) {
            setMovie({
              title: title,
              description: description,
              imageLink: image,
            });
            toast.success("Movie Updated Successfully");
          }
        }}
      >
        Update
      </Button>
      <DeleteMovie />
    </Card>
  );
}

UpdateMovie.propTypes = {
  movieId: PropTypes.string.isRequired,
};

export default UpdateMovie;
