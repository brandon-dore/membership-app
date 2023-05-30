export const getUsers = async () => {
  fetch("http://localhost:3000/users")
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
