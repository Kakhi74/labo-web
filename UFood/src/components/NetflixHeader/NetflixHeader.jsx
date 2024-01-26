import classes from "./NetflixHeader.module.css";

export default function NetflixHeader(props) {
  console.log("hello from NetflixHeader", props.ambianceRestaurants);
  return (
    <div className={classes.bannerpic}>
      {props.ambianceRestaurants.map((restaurant, index) => (
        <img key={index} src={restaurant.pictures[1]} />
      ))}
    </div>
  );
}
