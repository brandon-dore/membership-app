export const convertDate = (date) => {
  if (date) {
    date = date.split("T")[0].split("-");
    return date.reverse().join("/");
  }
  return date;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const checkDate = (d) => {
  let today = Date.now();
  return today > new Date(d);
};