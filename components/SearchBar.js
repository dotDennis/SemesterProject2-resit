import Link from "next/link";
import { useState } from "react";
import Row from "react-bootstrap/Row";

// https://www.youtube.com/watch?v=x7niho285qs

export default function NavSearch({ placeholder, data }) {
  const [filteredData, setFilteredData] = useState([]);
  const [inputEntry, setInputEntry] = useState([]);

  const handleFilter = (event) => {
    const searchQuery = event.target.value;
    setInputEntry(searchQuery);
    const newFilter = data.filter((value) => {
      return value.content.rendered.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (searchQuery === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  function clearInput() {
    setFilteredData([]);
    setInputEntry("");
  }

  const searchIcon = <span className="material-symbols-rounded">search</span>;
  const closeIcon = (
    <span className="material-symbols-rounded" onClick={clearInput}>
      close
    </span>
  );

  return (
    <div className="search">
      <div className="search__input">
        <input type="text" placeholder={placeholder} value={inputEntry} onChange={handleFilter} />
        <button className="search__input--icon">{inputEntry.length === 0 ? searchIcon : closeIcon}</button>
      </div>
      {filteredData.length != 0 && (
        <div className="search__result mdc-elevation--z1">
          {filteredData.slice(0, 5).map((value, key) => {
            let link = `/article/${value.slug}`;
            return (
              <div key={value.id} className="search__result--card ">
                <Link href={link}>
                  <a>
                    <Row className="gx-0">
                      <p className="">{value.title.rendered}</p>
                      <p className="text-dark" dangerouslySetInnerHTML={{ __html: value.excerpt.rendered }}></p>
                    </Row>
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
