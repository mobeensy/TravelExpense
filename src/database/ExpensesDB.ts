import { getDatabase } from "./Database";

// 🚀 Insert a new expense
export const insertExpense = async (
  tripId: number,
  category: string,
  location: string,
  amount: number,
  date: string,
  details: string
) => {
  const db = await getDatabase();
  if (!db) return;

  try {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        "INSERT INTO expenses (tripId, expenseCategory, expenseLocation, expenseAmount, expenseDate, expenseDetails) VALUES (?, ?, ?, ?, ?, ?);",
        [tripId, category, location, amount, date, details]
      );
    });
    console.log("✅ Expense inserted");
  } catch (error) {
    console.error("❌ Insert expense error:", error);
  }
};

// 🚀 Get expenses for a specific trip
export const getExpensesByTrip = async (tripId: number): Promise<any[]> => {
  const db = await getDatabase();
  if (!db) return [];

  console.log(`🛠️ Attempting to retrieve expenses for tripId: ${tripId}`);

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM expenses WHERE tripId = ? ORDER BY expenseDate DESC;",
          [tripId],
          (_, results) => {
            let expenses = [];
            for (let i = 0; i < results.rows.length; i++) {
              expenses.push(results.rows.item(i));
            }

            console.log(`✅ Retrieved ${expenses.length} expenses for tripId ${tripId}:`, expenses);
            resolve(expenses);
          }
        );
      },
      (error) => {
        console.error("❌ Get expenses error:", error);
        resolve([]); // ✅ Return an empty array if there's an error
      }
    );
  });
};


// 🚀 Delete an expense
export const deleteExpense = async (expenseId: number) => {
  const db = await getDatabase();
  if (!db) return;

  try {
    await db.transaction(async (tx) => {
      await tx.executeSql("DELETE FROM expenses WHERE expenseId = ?;", [expenseId]);
    });
    console.log("✅ Expense deleted");
  } catch (error) {
    console.error("❌ Delete expense error:", error);
  }
};
