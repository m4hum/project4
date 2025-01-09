from extensions import db

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    genre = db.Column(db.String(10), nullable=False)
    year_published = db.Column(db.String(10), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "description": self.description,
            "genre": self.genre,
            "yearPublished": self.year_published
        }
