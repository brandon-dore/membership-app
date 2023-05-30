import { useEffect, useState } from "react";

const SearchDates = () => {
  const [x, setX] = useState(false);

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

  return <div className="titleContainer"></div>;
};

export default SearchDates;
