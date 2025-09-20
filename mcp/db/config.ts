import * as sqlite3 from "sqlite3";
import { promisify } from "util";

sqlite3.verbose();

const db = new sqlite3.Database(":memory:");

const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

interface QueryResult {
  rowCount: number;
}

export const database = {
  run: dbRun,
  get: dbGet,
  all: dbAll,

  close: promisify(db.close.bind(db)),

  query: async (sql: string, params: any[] = []): Promise<QueryResult> => {
    return new Promise((resolve, reject) => {
      db.run(
        sql,
        params,
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            reject(err);
          } else {
            resolve({ rowCount: this.changes || 0 });
          }
        }
      );
    });
  },
};
