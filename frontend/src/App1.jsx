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
            <h1 style={{ fontSize: '3em', color: '#FFFACD', textShadow: '2px 2px 4px #000000' }}>Welcome</h1> {/* Lemon chiffon with black outline */}
            <iframe 
              src="https://giphy.com/embed/9X6OGGZ2SNyQ8" 
              width="100%" 
              height="100%" 
              style={{ position: 'absolute', top: 0, left: 0, zIndex: -2, opacity: 1, border: 'none' }} 
              className="giphy-embed" 
              allowFullScreen
            ></iframe>
            <button style={{ fontSize: '1.5em', padding: '15px 30px' }} onClick={() => setPage("bookCollection")}>Book Collection</button>
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
