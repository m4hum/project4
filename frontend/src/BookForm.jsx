import { useState } from "react";

const BookForm = ({ existingBook = {}, updateCallback }) => {
  // State variables for form fields
  const [title, setTitle] = useState(existingBook.title || ""); // State for the book title
  const [author, setAuthor] = useState(existingBook.author || ""); // State for the book author
  const [genre, setGenre] = useState(existingBook.genre || ""); // State for the book genre
  const [description, setDescription] = useState(existingBook.description || ""); // State for the book description
  const [yearPublished, setYearPublished] = useState(existingBook.yearPublished || ""); // State for the publication year

  // Check if the form is for updating an existing book or creating a new one
  const updating = Object.entries(existingBook).length !== 0;

  const onSubmit = async (e) => {
    // Function to handle form submission
    e.preventDefault(); // Prevent default form submission behaviour

    // Create the data object from the form fields
    const data = {
      title,
      author,
      genre,
      description,
      yearPublished,
    };

    // Determine the correct URL for the API based on whether we're updating or creating
    const url =
      "http://127.0.0.1:5000/api/books" +
      (updating ? `/${existingBook.id}` : ""); // If updating, include the book ID in the URL
    const options = {
      method: updating ? "PATCH" : "POST", // Use PATCH for updating, POST for creating
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(data), // Convert the data to JSON and include it in the request body
    };

    try {
      // Send the request to the API
      const response = await fetch(url, options);
      const responseData = await response.json(); // Parse the response data as JSON

      if (!response.ok) {
        alert(responseData.message || "An error occurred"); // Show an alert if the response is not OK
      } else {
        updateCallback(); // Call the callback to update the parent component (e.g., reload the book list)
      }
    } catch (error) {
      alert("Error communicating with the server: " + error.message); // Show an alert if there's an error with the fetch
    }
  };

  return (
    // Form element with onSubmit handler
    <form onSubmit={onSubmit}>
      {/* Title input field */}
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Update the title state on input change
        />
      </div>

      {/* Author input field */}
      <div>
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)} // Update the author state on input change
        />
      </div>

      {/* Genre input field */}
      <div>
        <label htmlFor="genre">Genre:</label>
        <input
          type="text"
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)} // Update the genre state on input change
        />
      </div>

      {/* Description input field */}
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Update the description state on input change
        />
      </div>

      {/* Year Published input field */}
      <div>
        <label htmlFor="yearPublished">Year Published:</label>
        <input
          type="text"
          id="yearPublished"
          value={yearPublished}
          onChange={(e) => setYearPublished(e.target.value)} // Update the yearPublished state on input change
        />
      </div>

      {/* Submit button with dynamic text based on whether we're updating or creating */}
      <button type="submit">{updating ? "Update Book" : "Create Book"}</button>
    </form>
  );
};

export default BookForm;
