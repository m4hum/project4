from flask import Blueprint, request, jsonify
from extensions import db
from models import Book, Author, Genre, YearPublished

book_routes = Blueprint("book_routes", __name__)

@book_routes.route("/api/books", methods=["GET"])
def get_books():
    # Retrieve all books from the database
    books = Book.query.all()
    # Convert the books to JSON format
    json_books = [book.to_json() for book in books]
    # Return the list of books as a JSON response
    return jsonify({"books": json_books})

@book_routes.route("/api/books", methods=["POST"])
def create_book():
    # Extract book details from the request JSON
    title = request.json.get("title")
    author_name = request.json.get("author")
    genre_name = request.json.get("genre")
    description = request.json.get("description")
    year_published_value = request.json.get("yearPublished")

    # Check if all required fields are provided
    if not title or not author_name or not genre_name or not description or not year_published_value:
        return jsonify({"message": "You must include a title, author, genre, description, and year_published"}), 400

    # Retrieve or create the author, genre, and year_published entries
    author = Author.query.filter_by(name=author_name).first()
    if not author:
        author = Author(name=author_name)
        db.session.add(author)
        db.session.commit()

    genre = Genre.query.filter_by(name=genre_name).first()
    if not genre:
        genre = Genre(name=genre_name)
        db.session.add(genre)
        db.session.commit()

    year_published = YearPublished.query.filter_by(year=year_published_value).first()
    if not year_published:
        year_published = YearPublished(year=year_published_value)
        db.session.add(year_published)
        db.session.commit()

    # Create a new book entry with the provided details
    new_book = Book(
        title=title,
        author=author_name,
        genre=genre_name,
        year_published=year_published_value,
        description=description,
    )
    try:
        # Add the new book to the database and commit the transaction
        db.session.add(new_book)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

    # Return a success message as a JSON response
    return jsonify({"message": "Book created successfully!"}), 201

@book_routes.route("/api/books/<int:id>", methods=["DELETE"])
def delete_book(id):
    # Retrieve the book by ID or return a 404 error if not found
    try:
        book = Book.query.get_or_404(id)
        # Delete the book from the database and commit the transaction
        db.session.delete(book)
        db.session.commit()
        # Return a success message as a JSON response
        return jsonify({"message": "Book has been deleted"}), 200
    except Exception as e:
        db.session.rollback()
        # Handle any exceptions and return an error message if needed
        return jsonify({"error": str(e)}), 500

@book_routes.route("/api/books/<int:id>", methods=["PATCH"])
def update_book(id):
    # Retrieve the book by ID or return a 404 error if not found
    book = Book.query.get_or_404(id)
    # Extract updated book details from the request JSON
    data = request.json

    # Update the book details with the provided data
    book.title = data.get("title", book.title)
    author_name = data.get("author")
    genre_name = data.get("genre")
    book.description = data.get("description", book.description)
    year_published_value = data.get("yearPublished", book.year_published)

    # Retrieve or create the author, genre, and year_published entries if updated
    if author_name:
        author = Author.query.filter_by(name=author_name).first()
        if not author:
            author = Author(name=author_name)
            db.session.add(author)
            db.session.commit()
        book.author = author.name

    if genre_name:
        genre = Genre.query.filter_by(name=genre_name).first()
        if not genre:
            genre = Genre(name=genre_name)
            db.session.add(genre)
            db.session.commit()
        book.genre = genre.name

    if year_published_value:
        year_published = YearPublished.query.filter_by(year=year_published_value).first()
        if not year_published:
            year_published = YearPublished(year=year_published_value)
            db.session.add(year_published)
            db.session.commit()
        book.year_published = year_published.year

    try:
        # Commit the transaction to save the changes
        db.session.commit()
        # Return the updated book details as a JSON response
        return jsonify(book.to_json()), 200
    except Exception as e:
        db.session.rollback()
        # Handle any exceptions and return an error message if needed
        return jsonify({"error": str(e)}), 500
