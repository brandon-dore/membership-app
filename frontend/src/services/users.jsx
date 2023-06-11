export const getUsers = async () => {
  fetch("http://localhost:3000/members")
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
