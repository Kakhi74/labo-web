import { Link } from "react-router-dom";
import classes from "./NavigationBar.module.css";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function NavigationBar() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputValue(e.target.value);
    console.log(inputValue);
  };

  return (
    <>
      <div className={classes.logo}>
        <Link to="/">
          <img className={classes.fas} src={logo} alt="logo" />
        </Link>
      </div>
      <label className={classes.open_search} htmlFor={classes.open_search}>
        <FontAwesomeIcon
          className={`${classes.fas} ${classes.fa_search}`}
          icon={faSearch}
        />
        <input
          className={classes.input_open_search}
          id={classes.open_search}
          type="checkbox"
          name="menu"
        />
        <div className={classes.search}>
          <form onSubmit={handleSubmit}>
            <button className={classes.button_search} type="submit">
              <FontAwesomeIcon
                className={`${classes.fas} ${classes.fa_search}`}
                icon={faSearch}
              />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search on UFood..."
              className={classes.input_search}
            />
          </form>
        </div>
      </label>
      <nav className={classes.nav_content}>
        <ul className={classes.nav_content_list}>
          <li
            className={`${classes.nav_content_item} ${classes.account_login}`}
          >
            <Link to="/login">
              <label
                className={classes.open_menu_login_account}
                htmlFor={classes.open_menu_login_account}
              >
                <input
                  className={classes.input_menu}
                  id={classes.open_menu_login_account}
                  type="checkbox"
                  name="menu"
                />
                <FontAwesomeIcon className={classes.fas} icon={faUserCircle} />
                <span className={classes.login_text}>
                  Hello, {"Sign in"} <strong>Create Account</strong>
                </span>
              </label>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default NavigationBar;
