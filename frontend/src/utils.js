export const convertDate = (date) => {
  if (date) {
    date = date.split("T")[0].split("-");
    return date.reverse().join("/");
  }
  return date;
};

export const pgDate = (date)=> {
  if(date){
    date = date.split('/')
    return date.reverse().join('/')
  }
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const checkDate = (d) => {
  let today = Date.now();
  let exp = d.split('/')
  exp = new Date(`${exp[2]}/${exp[1]}/${exp[0]}`)
  return today > exp;
};