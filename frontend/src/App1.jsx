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
            <iframe 
              src="https://giphy.com/embed/Y0ynz2rzJh2Dkxlelp" 
              width="100%" 
              height="100%" 
              style={{ position: 'absolute', top: 0, left: 0, zIndex: -2, opacity: 1 }} 
              frameBorder="0" 
              className="giphy-embed" 
              allowFullScreen
            ></iframe>
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
