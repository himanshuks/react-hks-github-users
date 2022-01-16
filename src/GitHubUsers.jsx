import axios from "axios";
import { useState } from "react";

export const GithubUsers = () => {
  const [userName, setUserName] = useState("");
  const [userRepoList, setUserRepoList] = useState([]);

  const getUserName = (e) => {
    setUserName(e.target.value);
  };

  const getUserRepositories = () => {
    axios
      .get(`https://api.github.com/users/${userName}/repos`)
      .then((res) => {
        console.log(`res`, res.data);
        if (res.data.length !== 0) {
          setUserRepoList(res.data);
        } else {
          console.log("User has no repos...");
        }
      })
      .catch((err) => {
        console.log("Error occurred", err);
      });
  };

  return (
    <div>
      <div className="App">
        <h2>Github User Repositories</h2>
        <input type="text" onChange={getUserName} />
        <button onClick={getUserRepositories}>Search</button>
      </div>
    </div>
  );
};
