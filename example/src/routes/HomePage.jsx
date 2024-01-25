import NavigationBar from "../components/NavigationBar/NavigationBar";
import NetflixSlider from "../components/RestaurantsBar/NetflixSlider";
import RestoNetflix from "../components/RestaurantsBar/RestoNetflix";
import style from "./HomePage.module.css";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getItemsPerScreen = () => {
  if (window.innerWidth < 600) {
    return 2;
  } else if (window.innerWidth < 800) {
    return 3;
  } else if (window.innerWidth < 1000) {
    return 4;
  } else {
    return 5;
  }
};

const aggregateGenresCounts = (obj) => {
  let counts = {};
  for (let key in obj) {
    if (key.includes(",")) {
      key.split(",").forEach((k) => {
        if (!counts[k]) counts[k] = 0;
        counts[k] += obj[key].length;
      });
    } else {
      if (!counts[key]) counts[key] = 0;
      counts[key] += obj[key].length;
    }
  }
  return counts;
};

const initializeGenres = (restaurants) => {
  let genres = new Array();
  const categories = Object.groupBy(restaurants, (resto) => resto.genres);

  let counts = aggregateGenresCounts(categories);
  let sortableArray = [];
  for (let category in counts) {
    sortableArray.push({ key: category, count: counts[category] });
  }

  const sortedCategories = sortableArray.sort((a, b) => a.count - b.count);

  for (const cat in sortedCategories) {
    genres.unshift(sortedCategories[cat].key);
  }

  return genres;
};

const initializeRestaurantsByGenres = (restaurants) => {
  const genres = initializeGenres(restaurants);
  let genreRestaurants = {};
  genres.forEach((genre) => {
    genreRestaurants[genre] = new Array();
    restaurants.forEach((resto) => {
      if (resto.genres.includes(genre)) {
        genreRestaurants[genre].push(resto);
      }
    });
  });
  Object.entries(genreRestaurants).map(([genre, restaurants]) =>
    console.log(genre, restaurants)
  );
  return genreRestaurants;
};

export default function HomePage() {
  const [restoGenres, setRestoGenres] = useState([]);
  const [itemsPerScreen, setItemsPerScreen] = useState(getItemsPerScreen());

  useEffect(() => {
    const handleResize = () => {
      const newItemsPerScreen = getItemsPerScreen();
      setItemsPerScreen(newItemsPerScreen);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const genresQuery = useQuery({
    queryKey: ["genres"],
    queryFn: () =>
      axios
        .get("https://ufoodapi.herokuapp.com/unsecure/restaurants?limit=130")
        .then((res) => res.data),
  });

  useEffect(() => {
    if (genresQuery.isSuccess) {
      const restaurants = genresQuery.data.items;
      setRestoGenres(initializeRestaurantsByGenres(restaurants));
    }
  }, [genresQuery.data, genresQuery.isSuccess]);

  if (genresQuery.isLoading) {
    return <h1>Loading...</h1>;
  }
  if (genresQuery.isError) {
    return <pre>{JSON.stringify(genresQuery.error)}</pre>;
  }

  return (
    <div className={style.fullPage}>
      <div className={style.navBar}>
        <NavigationBar />
      </div>
      <div className={style.content}>
        <div className={style.contentheader}></div>
        <div className={style.contentresto}>
          {genresQuery.isSuccess
            ? Object.entries(restoGenres).map(([genre, restaurants]) =>
                restaurants.length >= itemsPerScreen ? (
                  <NetflixSlider
                    restaurants={restaurants}
                    genre={genre}
                    itemsPerScreen={itemsPerScreen}
                    key={genre}
                  />
                ) : null
              )
            : null}
        </div>
      </div>
    </div>
  );
}
