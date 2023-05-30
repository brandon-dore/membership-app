import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    fetch("http://localhost:3000/users")
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        setUsers(data);
        console.log(data);
      });
  };
  return (
    <>
      <div className="titleContainer">
        <h1 className="pageTitle">
          <img className="logo" src="public/cupid.png" alt="logo" />
          Cupid's
          <img className="logo" src="public/cupid.png" alt="logo" />
        </h1>
        {users}
      </div>
      <div className="buttons">
        <button className="primaryButton">
          <div className="buttonContent">Enter Member ID</div>
        </button>
        <button className="primaryButton">
          <div className="buttonContent">Search Members</div>
        </button>
        <button className="primaryButton">
          <div className="buttonContent">Create New Member</div>
        </button>
      </div>
      <div className="secondaryButtons">
        <button className="secondaryButton">Member List</button>
        <button className="secondaryButton">Dates</button>
      </div>
    </>
  );
}

export default App;
