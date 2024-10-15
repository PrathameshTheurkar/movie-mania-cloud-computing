import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import movieState from "../recoil/atom/movieAtom";
import { useRecoilValue } from "recoil";

export default function MovieCard() {
  const movie = useRecoilValue(movieState);

  if (!movie) {
    return <div>No movie data available...</div>;
  }

  return (
    <Card
      variant="outlined"
      sx={{
        padding: 2,
        width: 300,
        height: "auto",
        margin: 3,
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        borderRadius: 3,
      }}
    >
      <CardActionArea>
        <img
          style={{ width: "100%", height: 180 }}
          src={movie.imageLink}
          alt={movie.title + " image"}
        />
      </CardActionArea>
      {/* <Divider  /> */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
