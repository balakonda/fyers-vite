export const formatNumber = (value) => {
  if (!value) {
    return "";
  }
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
};
