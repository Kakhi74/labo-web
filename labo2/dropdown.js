const showDropdown = () => {
  const dropdown = document.querySelector("#dropdown");

  const input = document.createElement("input");
  input.setAttribute("placeholder", "Search on UFood...");

  input.addEventListener("keyup", (e) => {
    const dropDownItems = document.querySelector("#dropdown-items");
    if (dropDownItems) dropDownItems.remove();
    const restaurants = [
      "McDonald",
      "Portofino",
      "BurgerKing",
      "Subway",
      "PizzaPizza",
      "Hanzo",
      "Mikes",
    ];
    const filteredRestaurants = restaurants.filter((restaurant) =>
      restaurant.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    const dropDownItem = document.createElement("div");
    dropDownItem.id = "dropdown-items";

    console.log(filteredRestaurants);

    if (filteredRestaurants.length === 0) {
      const item = document.createElement("div");
      item.innerText = "No results found";
      dropDownItem.appendChild(item);
    } else {
      filteredRestaurants.forEach((restaurant) => {
        const item = document.createElement("div");
        item.innerText = restaurant;
        dropDownItem.appendChild(item);
      });
    }
    dropdown.appendChild(dropDownItem);
  });

  dropdown.appendChild(input);

  const clearButton = document.createElement("button");
  clearButton.innerText = "X";
  clearButton.style.cursor = "pointer";

  clearButton.addEventListener("click", () => {
    const dropDownItems = document.querySelector("#dropdown-items");
    if (dropDownItems) dropDownItems.remove();
    input.value = "";
  });

  dropdown.appendChild(clearButton);
};
