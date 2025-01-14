import React from "react";

// BookList component to display a list of books and their details
const BookList = ({ books, updateBook, updateCallback }) => {
  const onDelete = async (id) => {
    // Function to handle book deletion
    try {
      const options = {
        method: "DELETE", // Set the HTTP method to DELETE for removing a book
      };
      const response = await fetch(
        `http://127.0.0.1:5000/api/books/${id}`, // Send the DELETE request to the API with the book ID
        options
      );
      if (response.status === 200) { // Check if the deletion was successful
        updateCallback(); // Call the callback to update the parent component (e.g., refresh the book list)
      } else {
        console.error("Failed to delete the book"); // Log an error if the deletion fails
      }
    } catch (error) {
      alert("Error deleting the book: " + error); // Show an alert if there's an error with the fetch
    }
  };

  const getCounts = (key) => {
    // Function to get counts of books by a specific key (e.g., author, genre, yearPublished)
    return books.reduce((acc, book) => {
      acc[book[key]] = (acc[book[key]] || 0) + 1; // Accumulate the count of each key (author, genre, or year)
      return acc;
    }, {});
  };

  // Get counts of books by author, genre, and year published
  const authorCounts = getCounts("author");
  const genreCounts = getCounts("genre");
  const yearCounts = getCounts("yearPublished");

  return (
    <div>
      <h2>Books</h2>
      {/* Table to display the list of books */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Description</th>
            <th>Year Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through each book and display its details in the table */}
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.description}</td>
              <td>{book.yearPublished}</td>
              <td>
                <div className="button-group">
                  {/* Button to trigger the book update form */}
                  <button onClick={() => updateBook(book)}>Update</button>
                  {/* Button to trigger the book deletion */}
                  <button onClick={() => onDelete(book.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Section to display the count of books by author */}
      <div style={{ marginTop: "20px" }}>
        <h3>Books by Author</h3>
        <table>
          <thead>
            <tr>
              <th>Author</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through each author and display the count of their books */}
            {Object.entries(authorCounts).map(([author, count]) => (
              <tr key={author}>
                <td>{author}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section to display the count of books by genre */}
      <div style={{ marginTop: "20px" }}>
        <h3>Books by Genre</h3>
        <table>
          <thead>
            <tr>
              <th>Genre</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through each genre and display the count of books in that genre */}
            {Object.entries(genreCounts).map(([genre, count]) => (
              <tr key={genre}>
                <td>{genre}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section to display the count of books by year of publication */}
      <div style={{ marginTop: "20px" }}>
        <h3>Books by Year Published</h3>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through each year and display the count of books published in that year */}
            {Object.entries(yearCounts).map(([year, count]) => (
              <tr key={year}>
                <td>{year}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;
