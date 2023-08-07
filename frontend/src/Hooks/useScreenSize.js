import { useState, useEffect } from "react";

const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({
      width: undefined,
      height: undefined,
    });
  
    useEffect(() => {
      const handleResize = () =>
        setScreenSize({ width: document.body.offsetWidth, height: document.body.offsetHeight });
  
      window.addEventListener('resize', handleResize);
  
      handleResize();
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    return screenSize;
};

export default useScreenSize;