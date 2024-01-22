import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const useResponsive = (query) => {
  const isMatching = useMediaQuery(query);
  const [isMediaMatching, setIsMediaMatching] = useState(isMatching);

  useEffect(() => {
    const handleResize = () => {
      setIsMediaMatching(useMediaQuery(query));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [query]);

  return isMediaMatching;
};

export default useResponsive;
