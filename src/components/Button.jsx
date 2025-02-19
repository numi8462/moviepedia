import useTranslate from "./hooks/useTranslate";
import "./Button.css";

function Button({ className, onClick, name }) {
  const t = useTranslate();
  console.log(className);

  return (
    <button className={className} onClick={onClick}>
      {t(name)}
    </button>
  );
}

export default Button;
