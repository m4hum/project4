import Author from './Author';
import Genre from './Genre';

class Book {
  constructor(id, title, author, genre, yearPublished, description) {
    this.id = id;
    this.title = title;
    this.author = author instanceof Author ? author : new Author(author.id, author.name);
    this.genre = genre instanceof Genre ? genre : new Genre(genre.id, genre.name);
    this.yearPublished = yearPublished;
    this.description = description;
  }
}

export default Book;
