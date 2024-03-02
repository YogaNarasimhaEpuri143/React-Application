import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { BiSort } from "react-icons/bi";
import "./user.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);

  const [sortType, setSortType] = useState("");
  const [sortDirDate, setSortDirDate] = useState(false);
  const [sortDirTime, setSortDirTime] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  const RECORDS_PER_PAGE = 20;

  const TOTAL_PAGES = Math.ceil(users.length / RECORDS_PER_PAGE);

  const customStyle = {
    color: "#1b0760",
  };

  const pagi_buttons = [];
  for (let i = 0; i < TOTAL_PAGES; i++) {
    pagi_buttons.push(
      <button
        key={i}
        onClick={() => handlePagination(i)}
        className="pagination__item"
      >
        {i}
      </button>
    );
  }

  const header = [
    "sno",
    "customer",
    "name",
    "age",
    "phone",
    "location",
    "date",
    "time",
    "dummy_data",
  ];

  const display_headers = header.map((h) => (
    <li key={h}>
      {h == "date" || h == "time" ? (
        <div
          className="header-sort-type"
          onClick={() => {
            h === "date" && setSortDirDate((dir) => !dir);
            h === "time" && setSortDirTime((dir) => !dir);
            return setSortType(h);
          }}
        >
          <h3 className="header__name">{h}</h3>
          <BiSort style={customStyle} />
        </div>
      ) : (
        <h3>{h}</h3>
      )}
    </li>
  ));

  const display_users = displayUsers.map((user) => (
    <ul key={user.sno} className="list list-inline">
      <li className="list__item">{user.name}</li>
      <li className="list__item">{user.customer}</li>
      <li className="list__item">{user.name}</li>
      <li className="list__item">{user.age}</li>
      <li className="list__item">{user.phone}</li>
      <li className="list__item">{user.location}</li>
      <li className="list__item">{user.date}</li>
      <li className="list__item">{user.time}</li>
      <li className="list__item">{user.dummy_data}</li>
    </ul>
  ));

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users_fetched = await axios.get("http://localhost:3000/users");
        setUsers(users_fetched.data.users);
        setDisplayUsers(
          getRequiredFormat(users_fetched.data.users.slice(0, 20))
        );
      } catch (error) {
        console.log("Error: " + error.message);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (sortType === "date") {
      const sortedUsers = [...displayUsers].sort((a, b) => {
        return sortDirDate
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      });
      setDisplayUsers(sortedUsers);
    }

    if (sortType === "time") {
      // Sort the data based on the "time" key
      const sortedData = [...displayUsers].sort((a, b) => {
        // Use Moment.js to parse the time strings
        const aTime = moment(a.time, "HH:mm:ss");
        const bTime = moment(b.time, "HH:mm:ss");

        // Compare the moment objects using the isBefore method
        return sortDirTime
          ? aTime.isBefore(bTime)
            ? -1
            : 1
          : bTime.isBefore(aTime)
          ? -1
          : 1;
      });

      setDisplayUsers(sortedData);
    }
  }, [displayUsers, sortType, sortDirDate, sortDirTime]);

  function handlePagination(i) {
    let start_index = i == 0 ? 0 : RECORDS_PER_PAGE * i; // 0 - 20, 21 - 40, 41 - 60
    let end_index = RECORDS_PER_PAGE * (i + 1); // 20, 40, 60

    setStartIndex(start_index);
    setEndIndex(end_index);

    setDisplayUsers(getRequiredFormat(users.slice(start_index, end_index)));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const searchedUsers = [...users]
      .filter((u) => u.name.includes(searchName))
      .filter((u) => {
        console.log(u.location, typeof searchLocation);
        return u.location.includes(searchLocation);
      });

    setDisplayUsers(searchedUsers);
  }

  function getRequiredFormat(users) {
    return users.map((user) => {
      const dateObj = new Date(user.created_at);

      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1; // Months are zero-indexed (January = 0)
      const day = dateObj.getDate();

      const hours = dateObj.getHours();
      const minutes = dateObj.getMinutes();
      const seconds = dateObj.getSeconds();

      const date = `${year}-${month}-${day}`;
      const time = `${hours}:${minutes}:${seconds}`;

      user.date = date;
      user.time = time;

      return user;
    });
  }

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)} className="input-form">
        <input
          type="text"
          placeholder="Enter the name ..."
          onChange={(e) => setSearchName(e.target.value.trim())}
        />
        <input
          type="text"
          placeholder="Enter the location ..."
          onChange={(e) => setSearchLocation(e.target.value.trim())}
        />

        <button type="submit" className="input-form__submit__button">
          Submit
        </button>
      </form>

      <div className="container">
        <ul className="list list-inline header">{display_headers}</ul>
        {display_users}
      </div>

      <div className="result-pagi-container">
        <p className="results__data">
          Results:{" "}
          {`${startIndex + 1} - ${
            endIndex > users.length ? users.length : endIndex
          } / ${users.length}`}
        </p>
        <div className="pagination">{pagi_buttons}</div>
      </div>
    </>
  );
};

export default User;
