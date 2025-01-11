import { useState, useEffect } from "react";
import BookCollection from "./BookCollection";
import './Style.css';

function App() {
  const [page, setPage] = useState("main");

  const renderPage = () => {
    switch (page) {
      case "bookCollection":
        return (
          <>
            <button className="back-button" onClick={() => setPage("main")}>Back</button>
            <BookCollection />
          </>
        );
      default:
        return (
          <div className="main-page">
            <h1>Welcome</h1>
            <button onClick={() => setPage("bookCollection")}>Book Collection</button>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {renderPage()}
    </div>
  );
}

export default App;
