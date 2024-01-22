import NavigationBar from "../components/NavigationBar/NavigationBar";
import style from "./HomePage.module.css";
import SideBar from "../components/SideBar/SideBar";

export default function HomePage() {
  return (
    <div className={style.fullPage}>
      <div className={style.navBar}>
        <NavigationBar />
      </div>
      <div className={style.sideBar}>
        <SideBar />
      </div>
    </div>
  );
}
