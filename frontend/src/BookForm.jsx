import { useState } from "react";

const BookForm = ({ existingBook = {}, updateCallback }) => {
  const [title, setTitle] = useState(existingBook.title || "");
  const [author, setAuthor] = useState(existingBook.author || "");
  const [genre, setGenre] = useState(existingBook.genre || "");
  const [description, setDescription] = useState(existingBook.description || "");
  const [yearPublished, setYearPublished] = useState(existingBook.yearPublished || "");

  const updating = Object.entries(existingBook).length !== 0;

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      author,
      genre,
      description,
      yearPublished,
    };

    const url =
      "http://127.0.0.1:5000/api/books" +
      (updating ? `/${existingBook.id}` : "");
    const options = {
      method: updating ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();
      if (!response.ok) {
        alert(responseData.message || "An error occurred");
      } else {
        updateCallback();
      }
    } catch (error) {
      alert("Error communicating with the server: " + error.message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="genre">Genre:</label>
        <input
          type="text"
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="yearPublished">Year Published:</label>
        <input
          type="text"
          id="yearPublished"
          value={yearPublished}
          onChange={(e) => setYearPublished(e.target.value)}
        />
      </div>
      <button type="submit">{updating ? "Update Book" : "Create Book"}</button>
    </form>
  );
};

export default BookForm;
