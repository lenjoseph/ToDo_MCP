import * as sqlite3 from "sqlite3";
import { promisify } from "util";

// Enable verbose mode for debugging
sqlite3.verbose();

// Create in-memory SQLite database
const db = new sqlite3.Database(":memory:");

// Promisify database methods for async/await usage
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

// Track changes count manually since we can't access it directly after async operations
let lastChangesCount = 0;

// Define the query result type
interface QueryResult {
  rows: any[];
  rowCount: number;
}

// Database wrapper with promisified methods
export const database = {
  run: async (sql: string, params: any[] = []) => {
    const result = await dbRun(sql, params);
    lastChangesCount = (db as any).changes || 0;
    return result;
  },
  get: dbGet,
  all: dbAll,
  close: promisify(db.close.bind(db)),
  // For compatibility with pg-style queries
  query: async (sql: string, params: any[] = []): Promise<QueryResult> => {
    if (sql.trim().toUpperCase().startsWith("SELECT")) {
      const rows = await dbAll(sql, params);
      return { rows, rowCount: rows.length };
    } else {
      // For non-SELECT queries, we need to capture changes immediately
      return new Promise((resolve, reject) => {
        db.run(
          sql,
          params,
          function (this: sqlite3.RunResult, err: Error | null) {
            if (err) {
              reject(err);
            } else {
              // 'this' context contains the changes count
              resolve({ rows: [], rowCount: this.changes || 0 });
            }
          }
        );
      });
    }
  },
};
