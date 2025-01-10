import { useState, useEffect } from "react";
import BookList from "./BookList";
import BookForm from "./BookForm";
import CSVReader from "./CSVReader";
import './Style.css';
import Book from './models/Book';
import Author from './models/Author';
import Genre from './models/Genre';

function App() {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/books");
      if (response.ok) {
        const data = await response.json();
        const books = data.books.map(book => new Book(
          book.id,
          book.title,
          new Author(book.author.id, book.author.name),
          new Genre(book.genre.id, book.genre.name),
          book.yearPublished,
          book.description
        ));
        setBooks(books);
      } else {
        console.error("Failed to fetch books");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBook({});
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    if (isModalOpen) return;
    setCurrentBook(book);
    setIsModalOpen(true);
  };

  const onUpdate = () => {
    closeModal();
    fetchBooks();
  };

  const filteredBooks = books
    .filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (filter === "genre") {
        return a.genre.name.localeCompare(b.genre.name);
      } else if (filter === "year") {
        return a.yearPublished - b.yearPublished;
      } else if (filter === "author") {
        return a.author.name.localeCompare(b.author.name);
      }
      return 0;
    });

  return (
    <>
      <h1>Library</h1>
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button onClick={() => setFilter("genre")}>Genre</button>
        <button onClick={() => setFilter("year")}>Year</button>
        <button onClick={() => setFilter("author")}>Author</button>
      </div>

      {/* Use the CSVReader component to load the CSV file */}
      <CSVReader setBooks={setBooks} />

      {/* Book List Component */}
      <BookList books={filteredBooks} updateBook={openEditModal} updateCallback={onUpdate} />

      {/* Add New Book Button */}
      <button className="add-book-button" onClick={openCreateModal}>Add New Book</button>

      {/* Modal for Adding/Editing Books */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <BookForm existingBook={currentBook} updateCallback={onUpdate} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
