import { useState, useRef, useEffect } from "react";
import classes from "./NetflixCarousel.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function NetflixCarousel({
  restaurants,
  genre,
  itemsPerScreen,
  ...props
}) {
  const [sliderIndex, setSliderIndex] = useState(0);
  const restaurantsLen = restaurants.length;
  const [zindex, setZindex] = useState({ zIndex: 1 });
  const [maxHeight, setMaxHeight] = useState("auto");
  const rowRef = useRef(null);

  console.log("zindex", zindex);

  useEffect(() => {
    if (rowRef.current) {
      const currentHeight = rowRef.current.offsetHeight;
      const headerHeight = rowRef.current.querySelector(
        `.${classes.header}`
      ).offsetHeight;
      const newMaxHeight = currentHeight + headerHeight;
      setMaxHeight(`${newMaxHeight}px`);
    }
  }, []);

  const chunkArray = (array, chunkSize) => {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      let chunk = array.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
  };

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
    setZindex({ zIndex: 1 });
  };

  const handleMouseLeave = () => {
    setZindex({ zIndex: 2 });
  };

  return (
    <>
      <div className={classes.row} ref={rowRef}>
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
              <div className={classes.imagewrapper}>
                {restaurants.map((restaurant, index) => (
                  // <div
                  //   key={index}
                  //   className={classes.restoContainer}
                  //   style={{
                  //     width:
                  //       restaurantsLen < itemsPerScreen
                  //         ? `${100 / itemsPerScreen}%`
                  //         : `${100 / itemsPerScreen}%`,
                  //   }}
                  // >
                  <>
                    <img
                      // className={classes.thumb}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      // className={wait && classes.imagewait}
                      // whileHover={{ scale: 1.4 }}
                      key={index}
                      src={restaurant.pictures[1]}
                      alt={`Restaurant: ${restaurant.name}`}
                      style={{
                        maxWidth:
                          restaurantsLen < itemsPerScreen
                            ? `${100 / itemsPerScreen}vw`
                            : `${100 / itemsPerScreen}%`,
                        //zIndex: zindex.zIndex,

                        // transition: "transform 0.3s ease-in-out",
                      }}

                      // initial={{ scale: 1 }} // Start scale (optional)
                      // transition={{ startDelay: 0.6 }
                    />
                    {/* <img
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      key={index}
                      src={restaurant.pictures[1]}
                      alt={`Restaurant: ${restaurant.name}`}
                      style={{
                        maxWidth:
                          restaurantsLen < itemsPerScreen
                            ? `${100 / itemsPerScreen}vw`
                            : `${100 / itemsPerScreen}%`,
                      }}
                    /> */}
                  </>
                  /* <div className={classes.restoInfo}>
                    <h4 className={classes.restoName}>{restaurant.name}</h4>
                    <p className={classes.restoAddress}>{restaurant.address}</p>
                  </div>
                </div> */
                ))}
              </div>
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
