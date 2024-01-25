import NavigationBar from "../components/NavigationBar/NavigationBar";
import NetflixSlider from "../components/RestaurantsBar/NetflixSlider";
import style from "./HomePage.module.css";
import "./HomePage.css";
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
        console.log(k, obj[key].length, counts[k]);
      });
    } else {
      if (!counts[key]) counts[key] = 0;
      counts[key] += obj[key].length;
      console.log(key, obj[key].length, counts[key]);
    }
  }
  return counts;
};

const initializeGenres = (restaurants) => {
  let genres = new Array();
  const categories = Object.groupBy(restaurants, (resto) => resto.genres);

  console.log("categories,", categories);

  let counts = aggregateGenresCounts(categories);
  console.log("counts", counts);
  let sortableArray = [];
  for (let category in counts) {
    sortableArray.push({ key: category, count: counts[category] });
  }

  console.log("categorie object,", sortableArray);

  const sortedCategories = sortableArray.sort((a, b) => a.count - b.count);

  console.log("categorie object,", sortedCategories);

  for (const cat in sortedCategories) {
    genres.unshift(sortedCategories[cat].key);
  }

  console.log("genres", genres);
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
  console.log("genreRestaurants", genreRestaurants);
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
          <div id="longResto" className={style.long_resto_wrapper}>
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
          <div id="shortResto" className={style.short_resto_wrapper}>
            {genresQuery.isSuccess
              ? Object.entries(restoGenres).map(([genre, restaurants]) =>
                  restaurants.length < itemsPerScreen ? (
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
    </div>
  );
}
