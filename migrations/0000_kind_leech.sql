CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "movies" (
	"plotSummary" text NOT NULL,
	"imageUrl" text,
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"titleType" text NOT NULL,
	"rating" numeric,
	"runtime" integer,
	"year" integer,
	"genres" text,
	"votes" integer,
	"releaseDate" text,
	"directors" text,
	"embedding" vector(3072)
);
