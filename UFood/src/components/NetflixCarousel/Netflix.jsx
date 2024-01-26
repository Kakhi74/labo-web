import { useEffect, useState } from "react";

export default function Netflix({
  restaurants,
  genre,
  itemsPerScreen,
  ...props
}) {
  const [restoGroup, setrestoGroup] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const restaurantsLen = restaurants.length;

  const chunkArray = (array, chunkSize) => {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      let chunk = array.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
  };

  useEffect(() => {
    const groups = chunkArray(restaurants, itemsPerScreen);
    setrestoGroup(groups);
  }, [restaurants, itemsPerScreen]);

  const scrollLeft = () => {
    setActiveIndex((prevPage) => Math.max(prevPage - 1, 0));
  };

  const scrollRight = () => {
    setActiveIndex((prevPage) => Math.min(prevPage + 1, restoGroup.length - 1));
  };

  const scrollDirection = (index) => {
    let percentage = 0;
    if (index < activeIndex) {
      percentage = -100 * (activeIndex - index);
      return `${percentage}%`;
    }
    percentage = 100 * (index - activeIndex);
    return `${percentage}%`;
  };

  return (
    <nav className="tech-stack">
      <div id="carousel-container">
        <button className="arrow arrow-left" onClick={scrollLeft}>
          Left
        </button>

        {restoGroup.map((group, index) => (
          <div
            className={`tech-container ${
              index === activeIndex ? "active" : ""
            }`}
            style={
              index !== activeIndex
                ? { transform: `translateX(${scrollDirection(index)})` }
                : {}
            }
            key={index}
          >
            {group.map((resto, index) => (
              <div key={index} className="tech-link">
                <img
                  key={index}
                  src={resto.pictures[1]}
                  alt={`Restaurant: ${resto.name}`}
                />

                {/* <h2 className="tech-link-label">{tech.name}</h2> */}
              </div>
            ))}
          </div>
        ))}
        <button className="arrow arrow-right" onClick={scrollRight}>
          Right
        </button>
      </div>
    </nav>
  );
}
