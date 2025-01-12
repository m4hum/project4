import { useState, useEffect } from "react";
import BookList from "./BookList";
import BookForm from "./BookForm";
import BarChart from "./BarChart";
import './Style.css';

function BookCollection() {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState(null);
  const [genreFilter, setGenreFilter] = useState(null);
  const [yearFilter, setYearFilter] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/books");
      if (response.ok) {
        const data = await response.json();
        const books = data.books.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          yearPublished: book.yearPublished,
          description: book.description
        }));
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

  const getUniqueValues = (key) => {
    return [...new Set(books.map(book => book[key]))];
  };

  const applyFilters = (books) => {
    return books.filter(book => {
      return (!authorFilter || book.author === authorFilter) &&
             (!genreFilter || book.genre === genreFilter) &&
             (!yearFilter || book.yearPublished === yearFilter);
    });
  };

  const filteredBooks = applyFilters(
    books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getChartData = (key) => {
    const data = books.reduce((acc, book) => {
      acc[book[key]] = (acc[book[key]] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(data),
      datasets: [{
        label: `Number of Books by ${key}`,
        data: Object.values(data),
        backgroundColor: 'rgba(255, 215, 0, 0.2)', // Gold
        borderColor: 'rgba(255, 215, 0, 1)', // Gold
        borderWidth: 1
      }]
    };
  };

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
        <div className="filter-group">
          <button className="filter-button">Filter by Author</button>
          <div className="filter-options">
            {getUniqueValues('author').map(author => (
              <button
                key={author}
                className={`filter-option ${authorFilter === author ? 'active' : ''}`}
                onClick={() => setAuthorFilter(authorFilter === author ? null : author)}
              >
                {author}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <button className="filter-button">Filter by Genre</button>
          <div className="filter-options">
            {getUniqueValues('genre').map(genre => (
              <button
                key={genre}
                className={`filter-option ${genreFilter === genre ? 'active' : ''}`}
                onClick={() => setGenreFilter(genreFilter === genre ? null : genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <button className="filter-button">Filter by Year Published</button>
          <div className="filter-options">
            {getUniqueValues('yearPublished').map(year => (
              <button
                key={year}
                className={`filter-option ${yearFilter === year ? 'active' : ''}`}
                onClick={() => setYearFilter(yearFilter === year ? null : year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

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

      {/* Bar Charts */}
      <div className="charts">
        <h2 className="chart-title">Books by Genre for the Collection</h2>
        <BarChart data={getChartData('genre')} />
        <h2 className="chart-title">Books by Author for the Collection</h2>
        <BarChart data={getChartData('author')}  />
        <h2 className="chart-title">Books by Year Published for the Collection</h2>
        <BarChart data={getChartData('yearPublished')} />
      </div>
    </>
  );
}

export default BookCollection;
