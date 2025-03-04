import Papa from "papaparse";
import { writeFile, CachesDirectoryPath } from "react-native-fs";
import { formatExpensesForCSV } from "./FormatExpensesToCSV";

export const generateCSV = async (expenses: any[], tripName: string) => {
  try {
    const formattedData = formatExpensesForCSV(expenses);

    // Convert JSON to CSV
    const csv = Papa.unparse(formattedData);

    // ✅ File name: TravelExpenses_TripName_YYYY-MM-DD.csv
    const fileName = `TravelExpenses_${tripName}_${new Date().toISOString().split("T")[0]}.csv`;
    const filePath = `${CachesDirectoryPath}/${fileName}`;

    // ✅ Write the CSV file (UTF-8 BOM for Excel compatibility)
    await writeFile(filePath, "\uFEFF" + csv, "utf8");
    console.log("✅ CSV file created:", filePath);

    return filePath;
  } catch (err) {
    console.error("❌ CSV Generation Error:", err);
    return null;
  }
};


