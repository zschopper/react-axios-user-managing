import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <main>
        <header><h1>Felhasználó kezelés <i>React</i>-tel</h1></header>
      </main>

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Kártyák</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user-list">Lista</Link>
            </li>
          </ul>
        </div>
      </nav>
      <article>
        <Outlet />

      </article>
      <footer>zschopper</footer>
    </>
  )
};

export default Layout;