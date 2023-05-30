import { useEffect, useState } from "react";

const CheckInMember = () => {
  useEffect(() => {
    getX();
  }, []);

  const getX = () => {
    fetch("")
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        setX(data);
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <h1>test</h1>
    </>
  );
};

export default CheckInMember;
