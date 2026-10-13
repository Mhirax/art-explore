import Navbar from '../layout/Navbar.jsx';
import Herosection3 from '../layout/HeroTypographic.jsx';
import SpaceTypes from '../sections/SpaceTypes.jsx';
import PopularReviews from '../sections/PopularReviews.jsx';
import Mapheader from '../Map/LagosMap.jsx';
import MapView from '../Map/MapView.jsx';
import '../../App.jsx';

/**
 * Home — read top to bottom as a numbered guide to the city:
 *   01  Hero        — what this is
 *   02  Space types — what you are walking into
 *   03  Reviews     — what visitors said
 *   04  Map         — see it laid out
 *
 * The full searchable directory lives on its own route, /galleries,
 * reached from the "Galleries" nav link.
 */
function App() {
  return (
    <div className="app">
      <Navbar />
      <Herosection3 />
      <SpaceTypes />
      <PopularReviews />
      <Mapheader />
      <MapView />

      <footer className="site-footer">
        <div className="site-footer__inner">
          <p className="site-footer__mark">
            Art<span>Explore</span>
          </p>
          <p className="site-footer__line">
            Galleries, museums and cultural spaces across Lagos — mapped.
          </p>
          <p className="site-footer__legal">
            &copy; {new Date().getFullYear()} Art Explore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
