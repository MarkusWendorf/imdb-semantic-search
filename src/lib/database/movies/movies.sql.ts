import { type InferInsertModel } from "drizzle-orm";
import { decimal, integer, pgTable, text } from "drizzle-orm/pg-core";
import { vector } from "pgvector/drizzle-orm";

export const movies = pgTable("movies", {
  plotSummary: text("plotSummary").notNull(),
  imageUrl: text("imageUrl"),
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  titleType: text("titleType").notNull(),
  rating: decimal("rating"),
  runtime: integer("runtime"),
  year: integer("year"),
  genres: text("genres"),
  votes: integer("votes"),
  releaseDate: text("releaseDate"),
  directors: text("directors"),
  embedding: vector("embedding", { dimensions: 3072 }),
});

export type Movie = InferInsertModel<typeof movies>;
