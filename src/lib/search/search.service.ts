import { eq } from "drizzle-orm";
import OpenAI from "openai";
import { l2Distance } from "pgvector/drizzle-orm";
import type { Database } from "../database/db";
import { movies, type Movie } from "../database/movies/movies.sql";

export class SearchService {
  private openai: OpenAI;

  constructor(private db: Database) {
    this.openai = new OpenAI({
      apiKey: "<your-api-key-goes-here>",
    });
  }

  async search(searchTerm: string, limit = 10) {
    const embeddings = await this.getEmbeddings(searchTerm);

    const result = await this.db
      .select()
      .from(movies)
      .orderBy(l2Distance(movies.embedding, embeddings))
      .limit(limit);

    return result;
  }

  async getEmbeddings(input: string) {
    const result = await this.openai.embeddings.create({
      model: "text-embedding-3-large",
      input,
    });

    return result?.data?.[0].embedding;
  }

  async addMovie(movie: Movie) {
    const embedding = await this.getEmbeddings(movie.plotSummary);
    await this.db.update(movies).set({ embedding }).where(eq(movies.id, movie.id));
  }
}
