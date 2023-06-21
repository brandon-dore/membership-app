export const getUsers = async () => {
  fetch("http://localhost:3000/customers")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log(e);
    });
};
