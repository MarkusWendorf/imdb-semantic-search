import { readFileSync } from "fs";

export interface RawMovieData {
  id: string;
  title: string;
  url: string;
  titleType: string;
  rating: number | null;
  runtime: number | null;
  year: number | null;
  genres: string | null;
  votes: number | null;
  directors: string | null;
}

export async function collectMovieData(): Promise<RawMovieData[]> {
  const data = readFileSync("./data.json", "utf-8");
  const movies = JSON.parse(data);

  return movies.map((movie: any) => ({
    id: movie.titleId,
    title: movie.titleText,
    url: `https://www.imdb.com/title/${movie.titleId}/`,
    titleType: movie.titleType.id,
    rating: movie.ratingSummary?.aggregateRating,
    runtime: Math.ceil(movie.runtime / 60),
    year: movie.releaseYear || null,
    genres: (movie.genres || []).join(", "),
    votes: movie.ratingSummary?.voteCount || null,
    directors: (movie.directors || []).join(", "),
  }));
}
