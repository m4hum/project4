import { useState, useEffect } from "react"; 
import BookCollection from "./BookCollection"; 
import './Style.css';

function App() { 
  // Initial state to manage which page is displayed
  const [page, setPage] = useState("main");

  // Function to render the appropriate page based on the current state
  const renderPage = () => {
    switch (page) {
      case "bookCollection":
        return (
          <>
            {/* Button to navigate back to the main page */}
            <button className="back-button" onClick={() => setPage("main")}>Back</button>
            <BookCollection />
          </>
        );
      default:
        return (
          <div className="main-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            {/* Welcome heading with specific font size and shadow effect */}
            <h1 style={{ fontSize: '4em', color: '#FFFACD', textShadow: '2px 2px 4px #000000' }}>Welcome</h1> {/* Lemon chiffon with black outline */}
            {/* Description paragraph with specific font size, weight, and shadow effect */}
            <p style={{ fontSize: '1.5em', color: '#FFFACD', fontWeight: 'bold', marginTop: '10px', textShadow: '1px 1px 2px #000000' }}>Explore your extensive collection of books and manage your library with ease.</p>
            {/* Embedding a Giphy animation as the background */}
            <iframe 
              src="https://giphy.com/embed/9X6OGGZ2SNyQ8" 
              width="100%" 
              height="100%" 
              style={{ position: 'absolute', top: 0, left: 0, zIndex: -2, opacity: 1, border: 'none' }} 
              className="giphy-embed" 
              allowFullScreen
            ></iframe>
            {/* Button to navigate to the book collection page */}
            <button style={{ fontSize: '2em', padding: '15px 30px', marginTop: '20px' }} onClick={() => setPage("bookCollection")}>Book Collection</button>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {renderPage()} {/* Render the appropriate page based on the current state */}
    </div>
  );
}

export default App;
