from flask import Blueprint, request, jsonify
from extensions import db
from models import Book

book_routes = Blueprint("book_routes", __name__)

@book_routes.route("/api/books", methods=["GET"])
def get_books():
    books = Book.query.all()
    json_books = [book.to_json() for book in books]
    return jsonify({"books": json_books})

@book_routes.route("/api/books", methods=["POST"])
def create_book():
    title = request.json.get("title")
    author = request.json.get("author")
    genre = request.json.get("genre")
    description = request.json.get("description")
    year_published = request.json.get("yearPublished")

    if not title or not author or not genre or not description or not year_published:
        return jsonify({"message": "All fields are required"}), 400

    new_book = Book(
        title=title,
        author=author,
        genre=genre,
        description=description,
        year_published=year_published,
    )
    try:
        db.session.add(new_book)
        db.session.commit()
        return jsonify({"message": "Book created successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

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
