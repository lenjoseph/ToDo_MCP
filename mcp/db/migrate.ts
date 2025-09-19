import fs from "fs";
import path from "path";
import { database } from "./config";

async function migrate() {
  try {
    // Read the initialization SQL file
    const initSql = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8");

    // Split SQL commands by semicolon, but handle multi-line statements properly
    const statements: string[] = [];
    let currentStatement = "";
    let inTrigger = false;

    for (const line of initSql.split("\n")) {
      currentStatement += line + "\n";

      if (line.trim().toUpperCase().includes("CREATE TRIGGER")) {
        inTrigger = true;
      }

      if (inTrigger && line.trim() === "END") {
        statements.push(currentStatement.trim());
        currentStatement = "";
        inTrigger = false;
      } else if (!inTrigger && line.includes(";")) {
        // Split by semicolon for regular statements
        const parts = currentStatement.split(";");
        for (let i = 0; i < parts.length - 1; i++) {
          const statement = parts[i].trim();
          if (statement.length > 0) {
            statements.push(statement);
          }
        }
        currentStatement = parts[parts.length - 1];
      }
    }

    // Add any remaining statement
    if (currentStatement.trim().length > 0) {
      statements.push(currentStatement.trim());
    }

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

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
}

export { migrate };
