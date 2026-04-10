import { useEffect } from "react"; // import useEffect to run side-effects
import { useLocation } from "react-router-dom"; // import 'useLocation' hook to access current route's information

const ScrollToTop = () => { // define a functional component called 'ScrollToTop' to automatically scroll the window to the top
  const { pathname } = useLocation(); // extract pathname to detect when the route changes

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll the window to the top smoothly
  }, [pathname]); // re-run this side-effect when route changes

  return null; // render nothing since this component exists only to handle side-effect of scrolling smoothly to the top
};

export default ScrollToTop;