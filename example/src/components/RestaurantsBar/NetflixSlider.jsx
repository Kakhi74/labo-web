import { useState, useEffect, useCallback } from "react";
import classes from "./NetflixSlider.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const getItemsPerScreen = () => {
  if (window.innerWidth < 600) {
    return 2;
  } else if (window.innerWidth < 1000) {
    return 4;
  } else {
    return 5;
  }
};

export default function NetflixSlider({ restaurants, genre, ...props }) {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [itemsPerScreen, setItemsPerScreen] = useState(getItemsPerScreen());
  const restaurantsLen = restaurants.length;

  useEffect(() => {
    const slider = document.querySelector(`.${classes.slider}`);
    if (slider) {
      slider.style.setProperty("--items-per-screen", getItemsPerScreen());
      //   slider.style.setProperty("--items-per-screen", getItemsPerScreen());
    }

    const handleResize = () => {
      const newItemsPerScreen = getItemsPerScreen();
      setItemsPerScreen(newItemsPerScreen);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //   useEffect(() => {
  //     const slider = document.querySelector(`.${classes.slider}`);
  //     if (!slider) return;
  //     if (restaurantsLen < itemsPerScreen) {
  //       slider.style.setProperty("--items-per-screen", restaurantsLen.toString());
  //       setItemsPerScreen(restaurantsLen);
  //     } else {
  //       slider.style.setProperty("--items-per-screen", itemsPerScreen.toString());
  //     }
  //     console.log("restaurantsLen", restaurantsLen);
  //     console.log(
  //       "itemsPerScreen",
  //       itemsPerScreen,
  //       " --> ",
  //       slider.style.getPropertyValue("--items-per-screen")
  //     );
  //   }, [itemsPerScreen, restaurantsLen]);

  const calculateArrayInit = () => {
    if (restaurantsLen > itemsPerScreen) {
      return restaurantsLen - itemsPerScreen + 1;
    }
    return 1;
  };

  const handleArrowClick = (direction) => {
    setSliderIndex((prevIndex) => {
      let newIndex = direction === "left" ? prevIndex - 1 : prevIndex + 1;
      const progressBarItemCount = calculateArrayInit();

      if (newIndex < 0) newIndex = progressBarItemCount - 1;
      if (newIndex >= progressBarItemCount) newIndex = 0;
      return newIndex;
    });
    // const slider = document.querySelector(`.${classes.slider}`);
    // slider.setProperty("--slider-index", sliderIndex);
  };

  return (
    <>
      <div className={classes.row}>
        <div className={classes.container}>
          <button
            className={`${classes.handle} ${classes.left_handle} ${
              calculateArrayInit() === 1 ? classes.hidehandle : ""
            }`}
            onClick={() => handleArrowClick("left")}
          >
            <FontAwesomeIcon icon={faAngleLeft} className={classes.text} />
          </button>
          <div
            className={`${classes.slider} ${
              restaurantsLen < itemsPerScreen && classes.noslide
            }`}
            style={{
              transform: `translateX(${
                (sliderIndex * -100) / itemsPerScreen
              }%)`,
            }}
          >
            {/* <div className={classes.sliderimage}> */}
            {restaurants.map((restaurant, index) => (
              <img
                key={index}
                src={restaurant.pictures[1]}
                alt={`Restaurant ${index + 1}`}
                style={{
                  maxWidth: `${100 / itemsPerScreen}%`,
                }}
              />
            ))}
            {/* </div> */}
          </div>
          <button
            className={`${classes.handle} ${classes.right_handle} ${
              calculateArrayInit() === 1 ? classes.hidehandle : ""
            }`}
            onClick={() => handleArrowClick("right")}
          >
            <FontAwesomeIcon icon={faAngleRight} className={classes.text} />
          </button>
        </div>
        <div className={classes.header}>
          <h3 className={classes.title}>{capitalize(genre)}</h3>
          <div className={classes.progress_bar}>
            {[...Array(calculateArrayInit())].map((_, i) => (
              <div
                key={i}
                className={`${classes.progress_item} ${
                  i === sliderIndex && classes.active
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
