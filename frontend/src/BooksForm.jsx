import { useState } from "react";

const BooksForm = ({ existingBooks = {}, updateCallback }) => {
    const [yearPublished, setYearPublished] = useState(existingBooks.yearPublished || "1987");
    const [title, setTitleName] = useState(existingBooks.title || "harry potter");
    const [author, setAuthor] = useState(existingBooks.author || "jk rowling");

    const updating = Object.entries(existingBooks).length !== 0

    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            yearPublished,
            title,
            author
        }
        const url = "" + (updating ? `update_books/${existingBooks.id}` : "create_books")
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } else {
            updateCallback()
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="yearPublished">Year Published:</label>
                <input
                    type="text"
                    id="yearPublished"
                    value={yearPublished}
                    onChange={(e) => setYearPublished(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="title">Title Name:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitleName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="author">:</label>
                <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
            </div>
            <button type="submit">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default BooksForm