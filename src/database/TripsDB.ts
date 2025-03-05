import { getDatabase } from "./Database";

// 🚀 Insert a new trip
export const insertTrip = async (tripName: string): Promise<number> => {
  const db = await getDatabase();
  if (!db) return -1;

  return new Promise<number>((resolve, reject) => {
    const now = new Date().toISOString();
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO trips (tripName, tripDateCreated, tripLastModified) VALUES (?, ?, ?);`,
          [tripName, now, now],
          (_, resultSet) => {
            // resultSet.insertId is the new row’s ID
            resolve(resultSet.insertId);
          }
        );
      },
      (error) => {
        console.error("❌ Insert trip error:", error);
        reject(error);
      }
    );
  });
};


// 🚀 Get all trips
export const getTrips = async (): Promise<any[]> => {
  const db = await getDatabase();
  if (!db) return [];

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM trips ORDER BY tripDateCreated DESC;",
          [],
          (_, results) => {
            let trips = [];
            for (let i = 0; i < results.rows.length; i++) {
              const trip = results.rows.item(i);
              if (!trip.tripId) {
                console.warn("⚠️ Missing tripId in database row:", trip);
              }
              trips.push(trip);
            }
            resolve(trips);
          }
        );
      },
      (error) => {
        console.error("❌ Get trips error:", error);
        reject(error);
      }
    );
  });
};

// 🚀 Update a trip name
export const updateTripName = async (tripId: number, newTripName: string) => {
  const db = await getDatabase();
  if (!db) return;

  const now = new Date().toISOString();
  try {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        "UPDATE trips SET tripName = ?, tripLastModified = ? WHERE tripId = ?;",
        [newTripName, now, tripId]
      );
    });
  } catch (error) {
    console.error("❌ Update trip error:", error);
  }
};

// 🚀 Delete a trip (Cascades to expenses)
export const deleteTrip = async (tripId: number) => {
  const db = await getDatabase();
  if (!db) return;

  try {
    await db.transaction(async (tx) => {
      await tx.executeSql("DELETE FROM trips WHERE tripId = ?;", [tripId]);
    });
  } catch (error) {
    console.error("❌ Delete trip error:", error);
  }
};

export const getTripsByIds = async (tripIds: number[]): Promise<any[]> => {
  const db = await getDatabase();
  if (!db || tripIds.length === 0) return [];

  const placeholders = tripIds.map(() => "?").join(", "); // Creates (?, ?, ?) for SQL IN clause

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM trips WHERE tripId IN (${placeholders});`,
          tripIds,
          (_, results) => {
            let trips = [];
            for (let i = 0; i < results.rows.length; i++) {
              trips.push(results.rows.item(i));
            }
            resolve(trips);
          }
        );
      },
      (error) => {
        console.error("❌ Get trips by tripIds error:", error);
        reject([]);
      }
    );
  });
};

export const getTripsInRange = async (startDate: string, endDate: string): Promise<any[]> => {
  const db = await getDatabase();
  if (!db) return [];

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM trips WHERE tripDateCreated BETWEEN ? AND ?;`,
          [startDate, endDate],
          (_, results) => {
            let trips = [];
            for (let i = 0; i < results.rows.length; i++) {
              trips.push(results.rows.item(i));
            }
            resolve(trips);
          }
        );
      },
      (error) => {
        console.error("❌ Get trips error:", error);
        reject([]);
      }
    );
  });
};

export const updateTripCurrency = async (tripId: number, currencyUsed: string) => {
  const db = await getDatabase();
  if (!db) return;

  try {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        `UPDATE trips 
         SET tripLastUsedCurrency = ?, 
             tripLastModified = datetime('now') 
         WHERE tripId = ?;`,
        [currencyUsed, tripId]
      );
    });
  } catch (error) {
    console.error("❌ Update trip error:", error);
  }
};
