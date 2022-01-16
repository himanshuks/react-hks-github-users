import axios from "axios";
import { useState } from "react";

export const GithubUsers = () => {
  const [userName, setUserName] = useState("");
  const [userRepoListLeft, setUserRepoListLeftPart] = useState([]);
  const [userRepoListRight, setUserRepoListRightPart] = useState([]);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showRepoList, setShowRepoList] = useState(false);
  const [owner, setOwner] = useState([]);
  const [totalRepos, setTotalRepos] = useState([]);

  const [followerListLeft, setFollowerListLeft] = useState([]);
  const [followerListRight, setFollowerListRight] = useState([]);

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
    setErrorMessage("");

    const user = e.target.id;

    if (user.length === 0) {
      setErrorMessage("Username can't be blank...!!!");
    } else {
      axios
        .get(`https://api.github.com/users/${user}/repos`)
        .then((res) => {
          const result = res.data;

          if (result.length !== 0) {
            let half_length = Math.ceil(result.length / 2);
            let leftSide = result.slice(0, half_length);
            let rightSide = result.slice(half_length, result.length);

            setShowRepoList(true);
            setOwner(result[0].owner);
            setTotalRepos(result.length);
            setUserRepoListLeftPart(leftSide);
            setUserRepoListRightPart(rightSide);
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
    setErrorMessage("");
    const user = e.target.id;

    axios
      .get(`https://api.github.com/users/${user}/followers`)
      .then((res) => {
        const result = res.data;

        if (result.length !== 0) {
          let half_length = Math.ceil(result.length / 2);
          let leftSide = result.slice(0, half_length);
          let rightSide = result.slice(half_length, result.length);

          setShowRepoList(false);
          setShowFollowers(true);
          setFollowerListLeft(leftSide);
          setFollowerListRight(rightSide);
        } else {
          setErrorMessage("This user has no followers on GitHub...!!!");
        }
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

  const DisplayUserRepo = (props) => {
    return (
      <div style={{ width: "50%", paddingRight: "3rem" }}>
        {props.repoList.map((obj) => (
          <div
            className="flex-container"
            key={obj.id}
            style={{ marginBottom: "1rem" }}
          >
            <div>
              <img
                src={owner.avatar_url}
                alt="Not found"
                style={{ width: "50px", height: "50px" }}
              ></img>
            </div>
            <div>
              <p>
                <label
                  onClick={showRepoDescription}
                  id={JSON.stringify(obj)}
                  style={{
                    cursor: "pointer",
                    color: "#0969da",
                    textDecoration: "underline",
                  }}
                >
                  {obj.name} &#9989;
                </label>
              </p>
              <p>{obj.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const DisplayUserFollowers = (props) => {
    return (
      <div>
        {props.followerList.map((obj) => (
          <div
            className="flex-container"
            key={obj.id}
            style={{ marginBottom: "1rem" }}
          >
            <div style={{ margin: "0 20px" }}>
              <img
                src={obj.avatar_url}
                alt="Not found"
                style={{ width: "60px", height: "60px" }}
              ></img>
            </div>
            <div>
              <div>
                <p>
                  <label style={{ fontWeight: "bold", marginRight: "1.5rem" }}>
                    UserName:
                  </label>
                  {obj.login}
                </p>
                <button
                  onClick={getUserRepositories}
                  id={obj.login}
                  className="followRepoBtn"
                >
                  Repositories
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="App">
        <h2 style={{ fontWeight: "bold" }}>Github User Repositories</h2>
        <div style={{ margin: "1rem" }}>
          <input type="text" onChange={getUserName} />
          <button
            onClick={getUserRepositories}
            id={userName}
            className="mainBtn"
            style={{ marginLeft: "1rem" }}
          >
            Search
          </button>
        </div>
        <span style={{ color: "red" }}>{errorMessage}</span>
      </div>

      {showRepoList && (
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <div className="flex-container">
              <div style={{ margin: "0rem 2rem" }}>
                <img
                  src={owner.avatar_url}
                  alt="Not found"
                  style={{ width: "100px", height: "100px" }}
                ></img>
              </div>
              <div>
                <div>
                  <p>
                    <label
                      style={{ fontWeight: "bold", marginRight: "1.5rem" }}
                    >
                      UserName:
                    </label>
                    {owner.login}
                  </p>
                  <p>
                    <label
                      style={{ fontWeight: "bold", marginRight: "1.5rem" }}
                    >
                      Total Repos:
                    </label>
                    {totalRepos}
                  </p>
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
          <div style={{ margin: "0rem 13rem" }}>
            <div className="flex-container">
              <DisplayUserRepo repoList={userRepoListLeft} />
              <DisplayUserRepo repoList={userRepoListRight} />
            </div>
          </div>
        </div>
      )}

      {showFollowers && (
        <div style={{ margin: "0rem 13rem" }}>
          <div className="flex-container">
            <DisplayUserFollowers followerList={followerListLeft} />
            <DisplayUserFollowers followerList={followerListRight} />
          </div>
        </div>
      )}

      {showDescription && (
        <div>
          <div className="flex-container">
            <div style={{ width: "40%" }}>
              <div style={{ textAlign: "center" }}>
                <img
                  src={imageURL}
                  alt="Not found"
                  style={{ width: "30%", height: "30%", marginLeft: "12rem" }}
                ></img>
              </div>
              <div style={{ padding: "2rem 0rem 2rem 15rem" }}>
                <p>
                  &#9989;
                  <label style={{ fontWeight: "bold", marginLeft: "1.5rem" }}>
                    Verified by GitHub
                  </label>
                </p>
                <p>
                  GitHub confirms that this app meets the
                  <span style={{ color: "#0d6efd" }}>
                    &nbsp;requirements for verification
                  </span>
                  .
                </p>
                <p style={{ margin: "30px 0px 10px 0px" }}>Categories</p>
                <div style={{ marginBottom: "5px" }}>
                  <button className="descBtn">Code Review</button>
                  <button className="descBtn">IDEs</button>
                  <button className="descBtn">Free</button>
                </div>
                <button className="descBtn">Paid</button>
              </div>
            </div>
            <div>
              <div>
                <h5>Application</h5>
                <h2 style={{ margin: "1.5rem 0rem 1.5rem 0rem" }}>
                  {currentRepoName}
                </h2>
                <button className="repoDesBtn">Set up a plan</button>
              </div>
              <div style={{ margin: "2rem 5rem 0rem 0rem" }}>
                <p>{currentRepoDescription}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
