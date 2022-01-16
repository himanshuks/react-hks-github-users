import axios from "axios";
import { useState } from "react";

export const GithubUsers = () => {
  const [userName, setUserName] = useState("");
  const [userRepoList, setUserRepoList] = useState([]);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showRepoList, setShowRepoList] = useState(false);
  const [owner, setOwner] = useState([]);
  const [totalRepos, setTotalRepos] = useState([]);

  const getUserName = (e) => {
    setUserName(e.target.value);
  };

  const getUserRepositories = (e) => {
    setShowFollowers(false);
    const user = e.target.id;

    axios
      .get(`https://api.github.com/users/${user}/repos`)
      .then((res) => {
        console.log(`res`, res.data);
        if (res.data.length !== 0) {
          setShowRepoList(true);
          setOwner(res.data[0].owner);
          setTotalRepos(res.data.length);
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
        <button onClick={getUserRepositories} id={userName}>
          Search
        </button>
      </div>
    </div>
  );
};
