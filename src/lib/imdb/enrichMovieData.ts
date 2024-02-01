import { JSDOM } from "jsdom";
import { type Movie } from "../database/movies/movies.sql";
import { type RawMovieData } from "./collectMovieData";

export async function enrichMovieData(movieList: RawMovieData[]): Promise<Movie[]> {
  const movies: Movie[] = [];

  for (const movie of movieList) {
    console.log(movie.title);

    const plotSummary = await fetchPlotSummary(movie.id);
    if (!plotSummary) continue;

    movies.push({
      ...movie,
      ...plotSummary,
      rating: movie.rating ? String(movie.rating) : null,
    });
  }

  return movies;
}

export async function fetchPlotSummary(movieId: string) {
  // Prevent rate limiting
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const document = await fetchDocument(`https://www.imdb.com/title/${movieId}/plotsummary/?ref_=tt_stry_pl#synopsis`);

  if (!document) {
    return undefined;
  }

  let plotSummary = document.querySelector('div[data-testid="sub-section-synopsis"]')?.textContent;

  if (!plotSummary || plotSummary.length > 30000) {
    plotSummary = parseSummaries(document.body);
  }

  return { plotSummary, imageUrl: parseImageUrl(document.body) };
}

async function fetchDocument(url: string): Promise<Document | undefined> {
  const response = await fetch(url, {
    headers: { "Accept-Language": "en-GB,en-US" },
  });

  if (!response.ok) {
    return undefined;
  }

  const html = await response.text();
  return new JSDOM(html).window.document;
}

function parseImageUrl(element: Element) {
  const src = element.querySelector(".ipc-image")?.getAttribute("src");
  if (!src) {
    return null;
  }

  const [_, options] = src.split("@");
  if (!options) return src;

  const parts = src.split("._V1_") || [];
  return parts[0] + "._V1_QL75_UX900_CR0,0,900,1330_.jpg";
}

function parseSummaries(element: Element) {
  const summaries = Array.from(
    element.querySelectorAll('div[data-testid="sub-section-summaries"] .ipc-html-content-inner-div'),
  );

  return summaries.map((summary) => summary.firstChild?.textContent || "").join(" ");
}
