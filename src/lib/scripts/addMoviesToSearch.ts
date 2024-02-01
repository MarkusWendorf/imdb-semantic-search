import { initDatabase } from "$lib/database/db";
import { movies } from "$lib/database/movies/movies.sql";
import { SearchService } from "$lib/search/search.service";
import { isNotNull, isNull } from "drizzle-orm";

async function addMoviesToSearch() {
  const { client, db } = initDatabase();
  const searchService = new SearchService(db);

  const movieList = await db.select().from(movies).where(isNull(movies.embedding));
  console.log(movieList.length);

  for (const movie of movieList) {
    await searchService.addMovie(movie);
  }

  client.end();
}

addMoviesToSearch();
