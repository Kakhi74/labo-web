import NavigationBar from "../components/NavigationBar/NavigationBar";
import RestoNetflix from "../components/RestaurantsBar/RestoNetflix";
import style from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={style.fullPage}>
      <div className={style.navBar}>
        <NavigationBar />
      </div>
      <div className={style.body}>
        <div className={style.restaurantsbar}>
          <RestoNetflix />
        </div>
      </div>
    </div>
  );
}
