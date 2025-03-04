export const formatExpensesForCSV = (expenses: Expense[]) => {
  return expenses.map((expense) => ({
    Date: expense.expenseDate,
    Category: expense.expenseCategory,
    Location: expense.expenseLocation,
    Amount: expense.expenseAmount,
    Currency: expense.expenseCurrency,
    Details: expense.expenseDetails || "", // Default to empty if no details
  }));
};