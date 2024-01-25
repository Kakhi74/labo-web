function fetchRestaurants() {
  return fetch("https://ufoodapi.herokuapp.com/unsecure/restaurants?limit=130")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
}

async function displayRestaurants() {
  try {
    const restaurants = await fetchRestaurants();
    console.log(restaurants);
    let genres = new Set();

    for (const restaurant of restaurants.items) {
      restaurant.genres.forEach((element) => {
        genres.add(element);
      });
    }
    console.log(genres);
  } catch (error) {
    console.error("Error processing restaurants:", error);
  }
}

displayRestaurants();
