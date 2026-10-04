import { useEffect } from "react";
import Navbar from "../layout/Navbar.jsx";
import ArtGalleryApp from "../gallery/ArtGalleryApp.jsx";
import "./GalleriesPage.scss";

/**
 * /galleries — the full searchable directory, on its own route.
 *
 * It used to sit at the bottom of the homepage, which meant every
 * visitor scrolled past the whole guide to reach the one thing they
 * might have come for. It is now the destination of the "Galleries"
 * nav link instead.
 */
export default function GalleriesPage() {
  // Arriving from a nav click mid-scroll on another page would
  // otherwise land part-way down this one.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="app">
      <Navbar />

      <header className="gp__head">
        <p className="gp__eyebrow">
          <span className="gp__eyebrow-rule" aria-hidden="true" />
          The directory
        </p>
        <h1 className="gp__title">Every space, in one list.</h1>
        <p className="gp__lede">
          Search by name, filter by district or kind of space, and sort the whole
          Lagos directory however you need it.
        </p>
      </header>

      <ArtGalleryApp />

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
