from extensions import db

class Author(db.Model):
    # Define the Author model with id, name, and relationship to books
    # The id is the primary key for the Author table
    # The name is a string with a maximum length of 100 characters and cannot be null
    # The books relationship defines a one-to-many relationship with the Book model
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    books = db.relationship('Book', backref='book_author', lazy=True)  # Renamed backref to avoid conflict

    def __init__(self, name):
        self.name = name

    def to_json(self):
        # Convert the Author instance to JSON format
        return {
            'id': self.id,
            'name': self.name,
            'books': [book.to_json() for book in self.books]
        }

class Genre(db.Model):
    # Define the Genre model with id, name, and relationship to books
    # The id is the primary key for the Genre table
    # The name is a string with a maximum length of 100 characters and cannot be null
    # The books relationship defines a one-to-many relationship with the Book model
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    books = db.relationship('Book', backref='book_genre', lazy=True)  # Renamed backref to avoid conflict

    def __init__(self, name):
        self.name = name

    def to_json(self):
        # Convert the Genre instance to JSON format
        return {
            'id': self.id,
            'name': self.name,
            'books': [book.to_json() for book in self.books]
        }

class YearPublished(db.Model):
    # Define the YearPublished model with id, year, and relationship to books
    # The id is the primary key for the YearPublished table
    # The year is an integer and cannot be null
    # The books relationship defines a one-to-many relationship with the Book model
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer, nullable=False)
    books = db.relationship('Book', backref='book_year_published', lazy=True)

    def __init__(self, year):
        self.year = year

    def to_json(self):
        # Convert the YearPublished instance to JSON format
        return {
            'id': self.id,
            'year': self.year,
            'books': [book.to_json() for book in self.books]
        }

class Book(db.Model):
    # Define the Book model with id, title, author, genre, year_published, and description
    # The id is the primary key for the Book table
    # The title is a string with a maximum length of 100 characters and cannot be null
    # The author is a foreign key referencing the name column in the Author table and cannot be null
    # The genre is a foreign key referencing the name column in the Genre table and cannot be null
    # The year_published is a foreign key referencing the year column in the YearPublished table and cannot be null
    # The description is a string with a maximum length of 500 characters and cannot be null
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), db.ForeignKey('author.name'), nullable=False)
    genre = db.Column(db.String(100), db.ForeignKey('genre.name'), nullable=False)
    year_published = db.Column(db.Integer, db.ForeignKey('year_published.year'), nullable=False)
    description = db.Column(db.String(500), nullable=False)

    def __init__(self, title, author, genre, year_published, description):
        self.title = title
        self.author = author
        self.genre = genre
        self.year_published = year_published
        self.description = description

    def to_json(self):
        # Convert the Book instance to JSON format
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'genre': self.genre,
            'yearPublished': self.year_published,
            'description': self.description
        }
