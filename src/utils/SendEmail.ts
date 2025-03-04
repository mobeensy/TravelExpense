import Share from "react-native-share";

export const sendCSVByEmail = async (filePath: string) => {
  try {
    await Share.open({
      title: "Export Expenses",
      subject: "TravelExpense Export",
      message: "Attached is your expense report from TravelExpense.",
      url: "file://" + filePath, // ✅ Attach the CSV file
      type: "text/csv",
    });

    console.log("✅ Email draft opened with attachment.");
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};
