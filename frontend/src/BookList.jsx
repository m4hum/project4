import React from "react";

const BookList = ({ books, updateBook, updateCallback }) => {
  const onDelete = async (id) => {
    try {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(
        `http://127.0.0.1:5000/api/books/${id}`,
        options
      );
      if (response.status === 200) {
        updateCallback();
      } else {
        console.error("Failed to delete the book");
      }
    } catch (error) {
      alert("Error deleting the book: " + error);
    }
  };

  const getCounts = (key) => {
    return books.reduce((acc, book) => {
      acc[book[key]] = (acc[book[key]] || 0) + 1;
      return acc;
    }, {});
  };

  const authorCounts = getCounts("author");
  const genreCounts = getCounts("genre");
  const yearCounts = getCounts("yearPublished");

  return (
    <div>
      <h2>Books</h2>
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
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.description}</td>
              <td>{book.yearPublished}</td>
              <td>
                <div className="button-group">
                  <button onClick={() => updateBook(book)}>Update</button>
                  <button onClick={() => onDelete(book.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
            {Object.entries(authorCounts).map(([author, count]) => (
              <tr key={author}>
                <td>{author}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            {Object.entries(genreCounts).map(([genre, count]) => (
              <tr key={genre}>
                <td>{genre}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
