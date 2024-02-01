import { initDatabase } from "$lib/database/db.js";
import { SearchService } from "$lib/search/search.service.js";

const { db } = initDatabase();
const searchService = new SearchService(db);

export async function load({ url }) {
  const search = url.searchParams.get("search");
  if (!search) {
    return { search: "", movies: [] };
  }

  const movies = await searchService.search(search);

  return {
    search,
    movies,
  };
}
