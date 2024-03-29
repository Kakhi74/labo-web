import { useState } from "react";
import classes from "./NetflixSlider.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function NetflixSlider({
  restaurants,
  genre,
  itemsPerScreen,
  ...props
}) {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [wait, setWait] = useState(false);
  const restaurantsLen = restaurants.length;

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
  };

  const handleMouseEnter = () => {
    console.log("mouse enter");
    if (wait) {
      setTimeout(() => {
        setWait(false);
      }, 1000);
    }
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
            className={`${classes.slider}`}
            style={{
              transform: `translateX(${
                (sliderIndex * -100) / itemsPerScreen
              }%)`,
            }}
          >
            <div className={classes.sliderimage}>
              {restaurants.map((restaurant, index) => (
                <img
                  onMouseEnter={handleMouseEnter}
                  key={index}
                  src={restaurant.pictures[1]}
                  alt={`Restaurant: ${restaurant.name}`}
                  style={{
                    maxWidth:
                      restaurantsLen < itemsPerScreen
                        ? `${100 / itemsPerScreen}vw`
                        : `${100 / itemsPerScreen}%`,
                  }}
                />
              ))}
            </div>
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
