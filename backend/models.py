from extensions import db

class Author(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    books = db.relationship('Book', backref='book_author', lazy=True)  # Renamed backref to avoid conflict

    def __init__(self, name):
        self.name = name

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'books': [book.to_json() for book in self.books]
        }

class Genre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    books = db.relationship('Book', backref='book_genre', lazy=True)  # Renamed backref to avoid conflict

    def __init__(self, name):
        self.name = name

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'books': [book.to_json() for book in self.books]
        }

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), db.ForeignKey('author.name'), nullable=False)  # Foreign key to Author
    genre = db.Column(db.String(100), db.ForeignKey('genre.name'), nullable=False)  # Foreign key to Genre
    year_published = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(500), nullable=False)

    def __init__(self, title, author, genre, year_published, description):
        self.title = title
        self.author = author
        self.genre = genre
        self.year_published = year_published
        self.description = description

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'genre': self.genre,
            'yearPublished': self.year_published,
            'description': self.description
        }
