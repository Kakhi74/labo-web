import NavigationBar from "../../components/NavigationBar/NavigationBar";
import NetflixCarousel from "../../components/NetflixCarousel/NetflixCarousel";
import style from "./HomePage.module.css";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Netflix from "../../components/NetflixCarousel/Netflix";

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
      console.log(restaurants);
      setRestoGenres(initializeRestaurantsByGenres(restaurants));
    }
  }, [genresQuery.data, genresQuery.isSuccess]);

  if (genresQuery.isLoading) {
    return <h1>Loading...</h1>;
  }
  if (genresQuery.isError) {
    return <pre>{JSON.stringify(genresQuery.error)}</pre>;
  }

  return genresQuery.isSuccess ? (
    <div className={style.fullPage}>
      <div className={style.navBar}>
        <NavigationBar />
      </div>
      <div className={style.content}>
        <div className={style.contentheader}>
          {/* <NetflixHeader ambianceRestaurants={ambiance} /> */}
        </div>
        <div className={style.contentresto}>
          <div id="longResto" className={style.long_resto_wrapper}>
            {Object.entries(restoGenres).map(([genre, restaurants]) =>
              restaurants.length >= itemsPerScreen ? (
                <NetflixCarousel
                  restaurants={restaurants}
                  genre={genre}
                  itemsPerScreen={itemsPerScreen}
                  key={genre}
                />
              ) : null
            )}
          </div>
          <div id="stack-carousel">
            {Object.entries(restoGenres).map(([genre, restaurants]) =>
              restaurants.length >= itemsPerScreen ? (
                <Netflix
                  key={`h-${genre}`}
                  restaurants={restaurants}
                  genre={`index-${genre}`}
                  itemsPerScreen={itemsPerScreen}
                />
              ) : null
            )}
          </div>
          <div id="shortResto" className={style.short_resto_wrapper}>
            {Object.entries(restoGenres).map(([genre, restaurants]) =>
              restaurants.length < itemsPerScreen ? (
                <NetflixCarousel
                  restaurants={restaurants}
                  genre={genre}
                  itemsPerScreen={itemsPerScreen}
                  key={genre}
                />
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
