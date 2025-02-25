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
            console.log("✅ Trip inserted with ID:", resultSet.insertId);
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
    console.log("✅ Trip updated");
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
    console.log("✅ Trip deleted");
  } catch (error) {
    console.error("❌ Delete trip error:", error);
  }
};
