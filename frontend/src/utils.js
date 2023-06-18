export const convertDate = (date) => {
  if (date) {
    date = date.split("T")[0].split("-");
    return date.reverse().join("/");
  }
  return date;
};

export const toBase64 = (arr) => {
  if (arr !== null) {
    const photo = atob(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    return photo;
  }
};
