import Link from "next/link";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useEffect, useState } from "react";

export default function topNav() {
  const [navbar, setNavbar] = useState(false);

  const changeNavbar = () => {
    if (window.scrollY >= 30) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavbar);
  }, []);

  return (
    <div className={navbar ? "mdc-elevation--z4  navbar navbar-expand-lg navbar-light bg-white sticky-top py-3" : "py-3 navbar navbar-expand-lg navbar-dark bg-dark sticky-top"}>
      <Container className="container-fluid">
        <Link href="/">
          <a className="navbar-brand" tabIndex="0">
            OneCoder
          </a>
        </Link>

        <DropdownButton
          variant="outline-white"
          title={
            <span className="d-flex justify-content-around px-2">
              <span className="material-symbols-rounded pe-2">menu</span>
              <span className="material-symbols-rounded  dropdown--account">person</span>
            </span>
          }
          id="input-group-dropdown-2"
          align="end"
        >
          <Link href="/login">
            <a className="nav-link dropdown-item" tabIndex="0" data-rr-ui-dropdown-item>
              Log in
            </a>
          </Link>

          <Dropdown.Divider />
          <Link href="/accomodations">
            <a className="nav-link dropdown-item" tabIndex="2" data-rr-ui-dropdown-item>
              Accomodations
            </a>
          </Link>
          <Link href="/contact">
            <a className="nav-link dropdown-item" tabIndex="4" data-rr-ui-dropdown-item>
              Contact us
            </a>
          </Link>
        </DropdownButton>
      </Container>
    </div>
  );
}
