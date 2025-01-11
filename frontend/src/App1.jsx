import { useState, useEffect } from "react";
import BookList from "./BookList";
import BookForm from "./BookForm";
import './Style.css';

function App() {
  const [page, setPage] = useState("main");

  const renderPage = () => {
    switch (page) {
      case "bookCollection":
        return <BookCollection />;
      case "dashboard":
        return <Dashboard />;
      default:
        return (
          <div className="main-page">
            <h1>Welcome</h1>
            <button onClick={() => setPage("bookCollection")}>Book Collection</button>
            <button onClick={() => setPage("dashboard")}>Dashboard</button>
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
