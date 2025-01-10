import React from "react"

const BooksList = ({ Books, updateBooks, updateCallback }) => {
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_Books/${id}`, options)
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
    }

    return <div>
        <h2>Books</h2>
        <table>
            <thead>
                <tr>
                    <th>Author Name</th>
                    <th>Title Name</th>
                    <th>title</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {Books.map((Books) => (
                    <tr key={Books.id}>
                        <td>{Books.author}</td>
                        <td>{Books.year_published}</td>
                        <td>{Books.title}</td>
                        <td>
                            <button onClick={() => updateBooks(Books)}>Update</button>
                            <button onClick={() => onDelete(Books.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default BooksList