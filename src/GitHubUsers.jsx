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

  const [showDescription, setShowDescription] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [currentRepoName, setCurrentRepoName] = useState("");
  const [currentRepoDescription, setCurrentRepoDescription] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const getUserName = (e) => {
    setErrorMessage("");
    setUserName(e.target.value);
  };

  const getUserRepositories = (e) => {
    setShowFollowers(false);
    setShowDescription(false);

    const user = e.target.id;

    if (user.length === 0) {
      setErrorMessage("Username can't be blank...!!!");
    } else {
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
            setErrorMessage("This user has no repos on GitHub...!!!");
          }
        })
        .catch(() => {
          setErrorMessage(
            "Oops, it seems this user doesn't exist on GitHub...!!!"
          );
        });
    }
  };

  const getUserFollowers = (e) => {
    setShowRepoList(false);
    setShowFollowers(true);
    setErrorMessage("");

    const user = e.target.id;

    axios
      .get(`https://api.github.com/users/${user}/followers`)
      .then((res) => {
        setFollowers(res.data);
      })
      .catch(() => {
        setErrorMessage("Error occurred. Please check network tab.");
      });
  };

  const showRepoDescription = (e) => {
    setShowRepoList(false);
    setShowFollowers(false);
    setShowDescription(true);
    setErrorMessage("");

    const obj = JSON.parse(e.target.id);

    setCurrentRepoDescription(obj.description);
    setCurrentRepoName(obj.name);
    setImageURL(obj.owner.avatar_url);
  };

  return (
    <div>
      <div className="App">
        <h2>Github User Repositories</h2>
        <input type="text" onChange={getUserName} />
        <button onClick={getUserRepositories} id={userName}>
          Search
        </button>
        <span style={{ color: "red" }}>{errorMessage}</span>
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
                  <button
                    onClick={getUserFollowers}
                    id={owner.login}
                    className="mainBtn"
                    style={{ margin: "0.5rem 0rem" }}
                  >
                    Followers
                  </button>
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
                      <label
                        onClick={showRepoDescription}
                        id={JSON.stringify(obj)}
                      >
                        {obj.name}
                      </label>
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

      {showDescription && (
        <div>
          <div className="flex-container">
            <div style={{ width: "30%" }}>
              <div style={{ textAlign: "center" }}>
                <img
                  src={imageURL}
                  alt="Not found"
                  style={{ width: "50%", height: "40%" }}
                ></img>
              </div>
              <p>Verified by GitHub</p>
              <p>
                GitHub confirms that this app meets the requirements for
                verification.
              </p>
              <p>Categories</p>
              <div>
                <button>Code Review</button>
                <button>IDEs</button>
                <button>Free</button>
              </div>
              <button>Paid</button>
            </div>
            <div>
              <div>
                <h6>Application</h6>
                <h2>{currentRepoName}</h2>
                <button>Set up a plan</button>
              </div>
              <div>
                <p>{currentRepoDescription}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
