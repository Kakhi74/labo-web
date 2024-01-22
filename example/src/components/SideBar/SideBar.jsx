import style from "./Sidebar.module.css"; // Make sure to create this CSS module

const Sidebar = () => {
  return (
    <div className={style.sidebar}>
      <a href="#home">Home</a>
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </div>
  );
};

export default Sidebar;
