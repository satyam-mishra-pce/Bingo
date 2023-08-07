import { useState, useEffect } from "react";

const useElementSize = element => {
    const [elementSize, setElementSize] = useState({
      width: undefined,
      height: undefined,
    });
  
    const obs = new ResizeObserver( entries => {
        setElementSize({
            width: entries[0].borderBoxSize[0].inlineSize,
            height: entries[0].borderBoxSize[0].blockSize
        })
    })

    useEffect(() => {
  
      obs.observe(element);
  
      return () => {
        obs.unobserve(element)
      };
    }, []);
  
    return elementSize;
};

export default useElementSize;