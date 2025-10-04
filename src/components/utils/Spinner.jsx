import { react, CSSProperties, useState } from "react";
import { ClipLoader } from "react-spinners";

const Spinner = () => {
  let [color, setColor] = useState("#1fdf6");

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  return (
    <ClipLoader
      color={color}
      size={150}
      cssOverride={override}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Spinner;
