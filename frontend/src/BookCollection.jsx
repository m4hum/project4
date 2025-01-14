import { useState, useEffect } from "react";
import BookList from "./BookList";
import BookForm from "./BookForm";
import BarChart from "./BarChart";
import './Style.css';

function BookCollection() {
  const [books, setBooks] = useState([]); // State to hold the list of books
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [currentBook, setCurrentBook] = useState({}); // State to store the currently selected book (for editing)
  const [searchTerm, setSearchTerm] = useState(""); // State to manage the search term for filtering books
  const [authorFilter, setAuthorFilter] = useState(null); // State for author filter
  const [genreFilter, setGenreFilter] = useState(null); // State for genre filter
  const [yearFilter, setYearFilter] = useState(null); // State for year published filter

  useEffect(() => {
    // Fetch books when the component mounts
    fetchBooks();
  }, []); // Empty dependency array means this effect runs only once after initial render

  const fetchBooks = async () => {
    // Function to fetch books from the API
    try {
      const response = await fetch("http://127.0.0.1:5000/api/books");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched books data:", data); // Debug log
        const books = data.books.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          genre: book.genre, 
          yearPublished: book.yearPublished,
          description: book.description
        }));
        console.log("Processed books data:", books); // Debug log
        setBooks(books);
      } else {
        console.error("Failed to fetch books");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const closeModal = () => {
    // Function to close the modal and reset current book
    setIsModalOpen(false);
    setCurrentBook({});
  };

  const openCreateModal = () => {
    // Function to open the modal for creating a new book
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    // Function to open the modal for editing an existing book
    if (isModalOpen) return; // Prevent opening modal if it's already open
    setCurrentBook(book); // Set the current book to be edited
    setIsModalOpen(true); // Open the modal
  };

  const onUpdate = () => {
    // Function to handle updates (after adding/editing a book) and refresh the book list
    closeModal(); // Close the modal after update
    fetchBooks(); // Fetch the updated book list
  };

  const getUniqueValues = (key) => {
    // Function to get unique values for a specific key (e.g., author, genre, yearPublished)
    return [...new Set(books.map(book => book[key]))]; // Return unique values from the books array
  };

  const applyFilters = (books) => {
    // Function to apply selected filters to the books list
    return books.filter(book => {
      return (!authorFilter || book.author === authorFilter) &&
             (!genreFilter || book.genre === genreFilter) &&
             (!yearFilter || book.yearPublished === yearFilter);
    });
  };

  // Filter books based on search term and applied filters
  const filteredBooks = applyFilters(
    books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getChartData = (key) => {
    // Function to generate chart data based on a specific key (author, genre, yearPublished)
    const data = books.reduce((acc, book) => {
      acc[book[key]] = (acc[book[key]] || 0) + 1; // Count the occurrences of each value
      return acc;
    }, {});
    return {
      labels: Object.keys(data), // The labels for the chart (e.g., author names, genres, years)
      datasets: [{
        label: `Number of Books by ${key}`, // Label for the dataset
        data: Object.values(data), // The values (counts) for the chart
        backgroundColor: 'rgba(255, 215, 0, 0.2)', // Light gold for the bar background
        borderColor: 'rgba(255, 215, 0, 1)', // Darker gold for the bar borders
        borderWidth: 1,
        font: {
          size: 16, // Increase font size for better readability
          family: 'Roboto', // Use a clear font
          weight: 'bold'
        }
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
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term as user types
        />
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        {/* Author filter */}
        <div className="filter-group">
          <button className="filter-button">Filter by Author</button>
          <div className="filter-options">
            {getUniqueValues('author').map(author => (
              <button
                key={author}
                className={`filter-option ${authorFilter === author ? 'active' : ''}`}
                onClick={() => setAuthorFilter(authorFilter === author ? null : author)} // Toggle author filter
              >
                {author}
              </button>
            ))}
          </div>
        </div>

        {/* Genre filter */}
        <div className="filter-group">
          <button className="filter-button">Filter by Genre</button>
          <div className="filter-options">
            {getUniqueValues('genre').map(genre => (
              <button
                key={genre}
                className={`filter-option ${genreFilter === genre ? 'active' : ''}`}
                onClick={() => setGenreFilter(genreFilter === genre ? null : genre)} // Toggle genre filter
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Year Published filter */}
        <div className="filter-group">
          <button className="filter-button">Filter by Year Published</button>
          <div className="filter-options">
            {getUniqueValues('yearPublished').map(year => (
              <button
                key={year}
                className={`filter-option ${yearFilter === year ? 'active' : ''}`}
                onClick={() => setYearFilter(yearFilter === year ? null : year)} // Toggle year filter
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
        <BarChart data={getChartData('author')} />
        <h2 className="chart-title">Books by Year Published for the Collection</h2>
        <BarChart data={getChartData('yearPublished')} />
      </div>
    </>
  );
}

export default BookCollection;
