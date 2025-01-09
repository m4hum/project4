from flask import Blueprint, request, jsonify
from extensions import db
from models import Book
import csv

book_routes = Blueprint("book_routes", __name__)

@book_routes.route("/api/books", methods=["GET"])
def get_books():
    books = Book.query.all()
    json_books = [book.to_json() for book in books]
    return jsonify({"books": json_books})

@book_routes.route("/api/books", methods=["POST"])
def create_book():
    # Extract fields from the request JSON payload
    title = request.json.get("title")
    author = request.json.get("author")
    genre = request.json.get("genre")
    description = request.json.get("description")
    year_published = request.json.get("yearPublished")

    # Check for required fields
    if not title or not author or not genre or not description or not year_published:
        return (
            jsonify(
                {
                    "message": "You must include a title, author, genre, description, and year_published"
                }
            ),
            400,
        )

    # Create a new Book object
    new_book = Book(
        title=title,
        author=author,
        genre=genre,
        description=description,
        year_published=year_published,
    )
    try:
        # Add the new book to the database
        db.session.add(new_book)
        db.session.commit()
    except Exception as e:
        # Handle any database errors
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Book created successfully!"}), 201

@book_routes.route("/api/books/<int:id>", methods=["DELETE"])
def delete_book(id):
    try:
        book = Book.query.get_or_404(id)
        db.session.delete(book)
        db.session.commit()
        return jsonify({"message": "Book has been deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@book_routes.route("/api/books/<int:id>", methods=["PATCH"])
def update_book(id):
    book = Book.query.get_or_404(id)
    data = request.json

    book.title = data.get("title", book.title)
    book.author = data.get("author", book.author)
    book.description = data.get("description", book.description)
    book.genre = data.get("genre", book.genre)
    book.year_published = data.get("yearPublished", book.year_published)

    try:
        db.session.commit()
        return jsonify(book.to_json()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@book_routes.route('/upload_csv', methods=['POST'])
def upload_csv():
    try:
        file = request.files['file']  # Ensure the key matches "file"
        if not file:
            return jsonify({"error": "No file provided"}), 400

        # Debug log
        print(f"Received file: {file.filename}")
        # Continue processing the file...
        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        if file and file.filename.endswith('.csv'):
            csv_file = file.stream.read().decode('utf-8')
            csv_reader = csv.DictReader(csv_file.splitlines())
            
            books_added = []
            for row in csv_reader:
                title = row.get("Title")
                author = row.get("Author")
                genre = row.get("Genre")
                description = row.get("Description")
                year_published = row.get("Year Published")

                if not title or not author: 
                    continue

                book = Book(
                    title=title,
                    author=author,
                    genre=genre,
                    description=description,
                    year_published=year_published
                )
                db.session.add(book) 
                books_added.append(title)

            db.session.commit()
            return jsonify({"message": "CSV uploaded successfully", "books_added": books_added}), 200
        
        return jsonify({"error": "Invalid file format. Please upload a CSV file."}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500