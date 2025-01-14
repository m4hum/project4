import pytest
from flask import Flask
from extensions import db
from models import Book
from routes import book_routes


@pytest.fixture
def app():
    """Set up Flask application for testing."""
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' 
    app.config['TESTING'] = True

    db.init_app(app)
    app.register_blueprint(book_routes)

    with app.app_context():
        db.create_all()
        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """Provide a test client for the Flask application."""
    return app.test_client()


def test_get_books_empty(client):
    """Test GET /api/books with no books in the database."""
    # Send a GET request to the /api/books endpoint
    # Assert that the response status code is 200 (OK)
    # Assert that the returned data contains an empty list of books
    response = client.get("/api/books")
    assert response.status_code == 200
    data = response.get_json()
    assert data["books"] == []


def test_create_book(client):
    """Test POST /api/books to create a new book."""
    # Define the payload for the new book
    # Send a POST request to the /api/books endpoint with the payload
    # Assert that the response status code is 201 (Created)
    # Assert that the response message indicates successful creation
    # Verify that the book is added to the database by sending a GET request
    # Assert that the book details match the payload
    payload = {
        "title": "Test Book",
        "author": "Test Author",
        "genre": "Fiction",
        "description": "A test book description.",
        "yearPublished": "2023",
    }
    response = client.post("/api/books", json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Book created successfully!"

    # Verify book is in the database
    response = client.get("/api/books")
    books = response.get_json()["books"]
    assert len(books) == 1
    assert books[0]["title"] == payload["title"]
    assert books[0]["author"] == payload["author"]
    assert books[0]["genre"] == payload["genre"]


def test_create_book_missing_fields(client):
    """Test POST /api/books with missing required fields."""
    # Define the payload with missing fields
    # Send a POST request to the /api/books endpoint with the payload
    # Assert that the response status code is 400 (Bad Request)
    # Assert that the response message indicates missing required fields
    payload = {
        "title": "Test Book",
        "author": "Test Author",
        # Missing genre, description, and yearPublished
    }
    response = client.post("/api/books", json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert data["message"] == "You must include a title, author, genre, description, and year_published"


def test_delete_book(client):
    """Test DELETE /api/books/<id>."""
    # Create a book to delete
    # Add the book to the database
    # Send a DELETE request to the /api/books/<id> endpoint
    # Assert that the response status code is 200 (OK)
    # Assert that the response message indicates successful deletion
    # Verify that the book no longer exists in the database by sending a GET request
    book = Book(
        title="Book to Delete",
        author="Author",
        genre="Genre",
        description="Description",
        year_published="2023",
    )
    db.session.add(book)
    db.session.commit()

    # Delete the book
    response = client.delete(f"/api/books/{book.id}")
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Book has been deleted"

    # Verify the book no longer exists
    response = client.get("/api/books")
    books = response.get_json()["books"]
    assert len(books) == 0


def test_update_book(client):
    """Test PATCH /api/books/<id>."""
    # Create a book to update
    # Add the book to the database
    # Define the payload with updated book details
    # Send a PATCH request to the /api/books/<id> endpoint with the payload
    # Assert that the response status code is 200 (OK)
    # Assert that the updated book details match the payload
    book = Book(
        title="Original Title",
        author="Original Author",
        genre="Original Genre",
        description="Original Description",
        year_published="2023",
    )
    db.session.add(book)
    db.session.commit()

    # Update the book
    payload = {
        "title": "Updated Title",
        "author": "Updated Author",
        "genre": "Updated Genre",
        "description": "Updated Description",
        "yearPublished": 2024,
    }
    response = client.patch(f"/api/books/{book.id}", json=payload)
    assert response.status_code == 200
    updated_book = response.get_json()
    assert updated_book["title"] == payload["title"]
    assert updated_book["author"] == payload["author"]
    assert updated_book["genre"] == payload["genre"]
    assert updated_book["description"] == payload["description"]
    assert updated_book["yearPublished"] == payload["yearPublished"]


def test_update_book_partial_fields(client):
    """Test PATCH /api/books/<id> with partial data."""
    # Create a book to update
    # Add the book to the database
    # Define the payload with partial book details
    # Send a PATCH request to the /api/books/<id> endpoint with the payload
    # Assert that the response status code is 200 (OK)
    # Assert that the updated book details match the payload and unchanged fields remain the same
    book = Book(
        title="Original Title",
        author="Original Author",
        genre="Original Genre",
        description="Original Description",
        year_published="2023",
    )
    db.session.add(book)
    db.session.commit()

    # Update only the title and author
    payload = {
        "title": "Partially Updated Title",
        "author": "Partially Updated Author",
    }
    response = client.patch(f"/api/books/{book.id}", json=payload)
    assert response.status_code == 200
    updated_book = response.get_json()
    assert updated_book["title"] == payload["title"]
    assert updated_book["author"] == payload["author"]
    assert updated_book["genre"] == book.genre  # Unchanged
    assert updated_book["description"] == book.description  # Unchanged
    assert updated_book["yearPublished"] == book.year_published  # Unchanged
