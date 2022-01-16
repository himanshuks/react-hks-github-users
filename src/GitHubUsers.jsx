import axios from "axios";
import { useState } from "react";

export const GithubUsers = () => {
  const [userName, setUserName] = useState("");
  const [userRepoList, setUserRepoList] = useState([]);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showRepoList, setShowRepoList] = useState(false);
  const [owner, setOwner] = useState([]);
  const [totalRepos, setTotalRepos] = useState([]);

  const [followers, setFollowers] = useState([]);

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

      {showRepoList && (
        <div>
          <div>
            <h3>User Details</h3>
            <div className="flex-container">
              <div>
                <img
                  src={owner.avatar_url}
                  alt="Not found"
                  style={{ width: "100px", height: "100px" }}
                ></img>
              </div>
              <div>
                <div>
                  <p>UserName: {owner.login}</p>
                  <p>Total Repos: {totalRepos}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>NAME</th>
                  <th>Description</th>
                </tr>
                {userRepoList.map((obj) => (
                  <tr key={obj.id}>
                    <td>
                      <img
                        src={owner.avatar_url}
                        alt="Not found"
                        style={{ width: "50px", height: "50px" }}
                      ></img>
                    </td>
                    <td>
                      <label>{obj.name}</label>
                    </td>
                    <td>{obj.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showFollowers &&
        followers.map((obj) => (
          <div
            className="flex-container"
            key={obj.id}
            style={{ marginBottom: "1rem" }}
          >
            <div style={{ margin: "0 20px" }}>
              <img
                src={obj.avatar_url}
                alt="Not found"
                style={{ width: "50px", height: "50px" }}
              ></img>
            </div>
            <div>
              <div>
                <p>UserName: {obj.login}</p>
                <button onClick={getUserRepositories} id={obj.login}>
                  Repositories
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
