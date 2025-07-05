import { PacmanLoader } from "react-spinners";
import style from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={style.backdrop}>
      <PacmanLoader color="#36bed6" size={60} />
    </div>
  );
}
