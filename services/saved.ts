import { ID, Query } from "react-native-appwrite";
import { tablesDB } from "./appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const SAVED_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_TABLE_ID!;

export type SavedRow = {
  $id: string;
  movie_id: number;
  saved_at: string;
  title?: string;
  poster_url?: string;
  vote_average?: number;
  popularity?: number;
  release_date?: string;
  genre_ids?: number[];
};

export type SavePayload = {
  id: number;
  title?: string;
  poster_path?: string | null | undefined;
  vote_average?: number;
  popularity?: number;
  release_date?: string;
  genre_ids?: number[];
};

// CREATE (save)
export async function saveMovie(movie: SavePayload) {
  try {
    return await tablesDB.createRow({
      databaseId: DATABASE_ID,
      tableId: SAVED_TABLE_ID,
      rowId: ID.unique(),
      data: {
        movie_id: movie.id,
        saved_at: new Date().toISOString(),
        title: movie.title,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : undefined,
        vote_average: movie.vote_average,
        popularity: movie.popularity,
        release_date: movie.release_date,
        genre_ids: movie.genre_ids ?? [],
      },
    });
  } catch (e: any) {
    // If you set a UNIQUE index on movie_id, a duplicate tap may throw 409/constraint.
    if (String(e?.message || "").includes("unique")) return getByMovieId(movie.id);
    throw e;
  }
}

// READ (list, sorted & paginated)
export async function listSaved(opts?: {
  limit?: number;
  cursorAfter?: string;
  sort?: "recent" | "rating" | "title" | "release";
}) {
  const queries = [Query.limit(opts?.limit ?? 24)];
  switch (opts?.sort ?? "recent") {
    case "recent":  queries.push(Query.orderDesc("saved_at")); break;
    case "rating":  queries.push(Query.orderDesc("vote_average")); break;
    case "title":   queries.push(Query.orderAsc("title")); break;
    case "release": queries.push(Query.orderDesc("release_date")); break;
  }
  if (opts?.cursorAfter) queries.push(Query.cursorAfter(opts.cursorAfter));

  const res = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: SAVED_TABLE_ID,
    queries,
  });

  return res; // res.rows is your array
}

// READ (by movie_id) – handy for duplicates or “isSaved” checks
export async function getByMovieId(movieId: number) {
  const res = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: SAVED_TABLE_ID,
    queries: [Query.equal("movie_id", movieId), Query.limit(1)],
  });
  return res.rows?.[0] ?? null;
}

// DELETE (unsave) by row id
export async function deleteSaved(rowId: string) {
  return tablesDB.deleteRow({
    databaseId: DATABASE_ID,
    tableId: SAVED_TABLE_ID,
    rowId,
  });
}
