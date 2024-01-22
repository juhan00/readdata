import useResponsive from "./useResponsive";

const Mobile = ({ children }) => {
  const isMobile = useResponsive({ maxWidth: 767 });
  return isMobile ? children : null;
};

const PC = ({ children }) => {
  const isPC = useResponsive({ minWidth: 768 });
  return isPC ? children : null;
};

export { Mobile, PC };
