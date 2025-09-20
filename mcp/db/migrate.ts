import fs from "fs";
import path from "path";
import { database } from "./config";

async function migrate() {
  try {
    const initSql = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8");

    const statements = initSql
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    for (const statement of statements) {
      if (statement.length > 0) {
        await database.run(statement);
      }
    }

    console.error("Database migration completed successfully...");
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrate();
}

export { migrate };
