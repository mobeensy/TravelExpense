import SQLite from "react-native-sqlite-storage";

// Enable debugging
SQLite.DEBUG(false); // set to true for more logs
SQLite.enablePromise(true);

export const getDatabase = async () => {
  try {
    const db = await SQLite.openDatabase(
      {
        name: "travel_expenses.db",
        location: "default",
      }
    );
    return db;
  } catch (error) {
    console.error("❌ Database open error:", error);
    return null;
  }
};

// 🚀 Initialize Database
export const initDatabase = async () => {
  const db = await getDatabase();
  if (!db) {
    console.error("❌ Failed to open the database");
    return;
  }

  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction(
        (tx) => {
          // ✅ Create Trips Table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS trips (
              tripId INTEGER PRIMARY KEY AUTOINCREMENT,
              tripName TEXT NOT NULL,
              tripLastUsedCurrency TEXT DEFAULT NULL,
              tripDateCreated TEXT NOT NULL,
              tripLastModified TEXT NOT NULL
            );`
          );

          // ✅ Create Expenses Table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS expenses (
             expenseId INTEGER PRIMARY KEY AUTOINCREMENT,
             tripId INTEGER NOT NULL,
             expenseCategory TEXT NOT NULL,
             expenseLocation TEXT,
             expenseAmount REAL NOT NULL,
             expenseDate TEXT NOT NULL,
             expenseDetails TEXT,
             expenseCurrency TEXT NOT NULL,
             FOREIGN KEY (tripId) REFERENCES trips (tripId) ON DELETE CASCADE
            );`
          );
        },
        (error) => {
          console.error("❌ Database transaction error:", error);
          reject(error);
        },
        () => {
          resolve();
        }
      );
    });
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
};

export const deleteDatabase = async () => {
  const db = await getDatabase();
  if (!db) {
    console.error("❌ Failed to open the database");
    return;
  }
  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction(
        (tx) => {
          // ✅ Create Trips Table
          tx.executeSql(
            `DROP TABLE IF EXISTS expenses;`
          );

          // ✅ Create Expenses Table
          tx.executeSql(
            `DROP TABLE IF EXISTS trips;`
          );
        },
        (error) => {
          console.error("❌ Database transaction error:", error);
          reject(error);
        },
        () => {
          resolve();
        }
      );
    });
  } catch (error) {

  }

}

