from flask import Blueprint, request, jsonify
from extensions import db
from models import Book, Author, Genre

book_routes = Blueprint("book_routes", __name__)

@book_routes.route("/api/books", methods=["GET"])
def get_books():
    books = Book.query.all()
    json_books = [book.to_json() for book in books]
    return jsonify({"books": json_books})

@book_routes.route("/api/books", methods=["POST"])
def create_book():
    title = request.json.get("title")
    author_name = request.json.get("author")
    genre_name = request.json.get("genre")
    description = request.json.get("description")
    year_published = request.json.get("yearPublished")

    if not title or not author_name or not genre_name or not description or not year_published:
        return jsonify({"message": "You must include a title, author, genre, description, and year_published"}), 400

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

    new_book = Book(
        title=title,
        author=author_name,
        genre=genre_name,
        year_published=year_published,
        description=description,
    )
    try:
        db.session.add(new_book)
        db.session.commit()
    except Exception as e:
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
    author_name = data.get("author")
    genre_name = data.get("genre")
    book.description = data.get("description", book.description)
    book.year_published = data.get("yearPublished", book.year_published)

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

    try:
        db.session.commit()
        return jsonify(book.to_json()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
