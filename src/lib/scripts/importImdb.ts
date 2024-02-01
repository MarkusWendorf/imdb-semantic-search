import { initDatabase } from "$lib/database/db";
import { movies } from "$lib/database/movies/movies.sql";
import { collectMovieData } from "$lib/imdb/collectMovieData";
import { enrichMovieData } from "$lib/imdb/enrichMovieData";

async function importImdbData() {
  const { client, db } = initDatabase();
  const data = await collectMovieData();

  const existingMovies = await db.select({ id: movies.id }).from(movies);
  const ids = new Set(existingMovies.map(({ id }) => id));

  const unprocessedMovies = data.filter((movie) => !ids.has(movie.id));
  console.log(unprocessedMovies.length);
  const movieList = await enrichMovieData(unprocessedMovies);

  db.transaction(async (tx) => {
    await Promise.all(
      movieList.map((movie) => tx.insert(movies).values(movie).onConflictDoNothing()),
    );
  });

  client.end();
}

importImdbData();
