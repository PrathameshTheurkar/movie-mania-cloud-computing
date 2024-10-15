import { useState } from "react";
import { useSetRecoilState } from "recoil";
import movieState from "../recoil/atom/movieAtom";
import axios from "axios";
import { useParams } from "react-router-dom";

export const useMovie = () => {
  let { movieId } = useParams();

  const setMovie = useSetRecoilState(movieState);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchMovie = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/admin/movie/" + movieId,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      setMovie(data.movie);
      setSuccess(true);
    }
    setMsg(data.message);
  };
  return {
    fetchMovie,
    success,
    msg,
  };
};
