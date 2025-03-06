export const getToday = () => new Date().toISOString().split("T")[0];
export const getYearAgo = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString().split("T")[0];
};