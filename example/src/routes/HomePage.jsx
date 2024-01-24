import NavigationBar from "../components/NavigationBar/NavigationBar";
import NetflixSlider from "../components/RestaurantsBar/NetflixSlider";
import RestoNetflix from "../components/RestaurantsBar/RestoNetflix";
import style from "./HomePage.module.css";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function aggregateCounts(obj) {
  let counts = {};
  for (let key in obj) {
    if (key.includes(",")) {
      for (const k of key.split(",")) {
        if (!counts[k]) {
          counts[k] = 0;
        }
        counts[k] += obj[key].length;
      }
    } else {
      if (!counts[key]) {
        counts[key] = 0;
      }
      counts[key] += obj[key].length;
    }
  }
  return counts;
}

const initializeGenres = (restaurants) => {
  let genres = new Set();
  const categories = Object.groupBy(restaurants, (resto) => resto.genres);

  let counts = aggregateCounts(categories);
  let sortableArray = [];
  for (let category in counts) {
    sortableArray.push({ key: category, count: counts[category] });
  }

  const sortedCategories = sortableArray.sort((a, b) => b.count - a.count);
  console.log(sortedCategories);

  for (const cat in sortedCategories) {
    genres.add(sortedCategories[cat].key);
  }

  return Array.from(genres);
};

export default function HomePage() {
  const [genres, setGenres] = useState([]);

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
      setGenres(Array.from(initializeGenres(restaurants)));
    }
  }, [genresQuery.data, genresQuery.isSuccess]);

  if (genresQuery.isLoading) return <h1>Loading...</h1>;
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
          {genres.map((genre) => (
            <NetflixSlider genre={genre} key={genre} />
          ))}
        </div>
      </div>
    </div>
  );
}
