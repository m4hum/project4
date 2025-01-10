import { useState, useEffect } from "react";
import BookList from "./BookList";
import BookForm from "./BookForm";

function App() {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/books");
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books);
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

  return (
    <>
      {/* Book List Component */}
      <BookList books={books} updateBook={openEditModal} updateCallback={onUpdate} />

      {/* Add New Book Button */}
      <button onClick={openCreateModal}>Add New Book</button>

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
