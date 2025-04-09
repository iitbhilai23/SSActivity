import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import interceptor from "../utils/interceptor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/FLNBookEntry.css"; // ✅ Custom CSS

function FLNBookEntry() {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("addBook");
    const [books, setBooks] = useState([]);

    const [bookData, setBookData] = useState({
        subject_id: "",
        schl_level: "",
        book_name: "",
        agency: "",
        total_books: "",
    });

    const [distribution, setDistribution] = useState({
        fln_book_id: "",
        agency_code: user?.agency_code || "",
        from_entity_id: "",
        to_entity_id: "",
        quantity: "",
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await interceptor.get("/books/all");
            setBooks(response.data);
        } catch (error) {
            toast.error("Failed to fetch books.");
        }
    };

    const handleBookChange = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };

    const handleDistributionChange = (e) => {
        setDistribution({ ...distribution, [e.target.name]: e.target.value });
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await interceptor.post("/books/add", bookData);
            toast.success("Book added successfully!");
            fetchBooks();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to add book.");
        }
    };

    const handleDistributeBook = async (e) => {
        e.preventDefault();
        try {
            await interceptor.post("/books/distribute", distribution);
            toast.success("Book distributed successfully!");
            fetchBooks();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to distribute book.");
        }
    };

    if (user?.role === "School") {
        return <h2>Access Denied</h2>; // ✅ Hide from Schools
    }

    return (
        <div className="fln-container">
            <ToastContainer />

            {/* ✅ Custom Tabs */}
            <div className="custom-tabs">
                <button className={activeTab === "addBook" ? "active" : ""} onClick={() => setActiveTab("addBook")}>
                    Add New Book
                </button>
                <button className={activeTab === "distributeBook" ? "active" : ""} onClick={() => setActiveTab("distributeBook")}>
                    Distribute Books
                </button>
                <button className={activeTab === "allBooks" ? "active" : ""} onClick={() => setActiveTab("allBooks")}>
                    All Books
                </button>
            </div>

            {/* ✅ Add New Book Section */}
            {activeTab === "addBook" && (
                <div className="tab-content">
                    <h3>Add New Book</h3>
                    <form onSubmit={handleAddBook} className="fln-form">
                        <input type="text" name="subject_id" placeholder="Subject ID" onChange={handleBookChange} required />
                        <input type="text" name="schl_level" placeholder="School Level" onChange={handleBookChange} required />
                        <input type="text" name="book_name" placeholder="Book Name" onChange={handleBookChange} required />
                        <input type="text" name="agency" placeholder="Agency" onChange={handleBookChange} required />
                        <input type="number" name="total_books" placeholder="Total Books" onChange={handleBookChange} required />
                        <button type="submit">Add Book</button>
                    </form>
                </div>
            )}

            {/* ✅ Distribute Books Section */}
            {activeTab === "distributeBook" && (
                <div className="tab-content">
                    <h3>Distribute Books</h3>
                    <form onSubmit={handleDistributeBook} className="fln-form">
                        <select name="fln_book_id" onChange={handleDistributionChange} required>
                            <option value="">Select Book</option>
                            {books.map((book) => (
                                <option key={book.id} value={book.id}>
                                    {book.book_name}
                                </option>
                            ))}
                        </select>
                        <input type="text" name="from_entity_id" placeholder="From Entity ID" onChange={handleDistributionChange} required />
                        <input type="text" name="to_entity_id" placeholder="To Entity ID" onChange={handleDistributionChange} required />
                        <input type="number" name="quantity" placeholder="Quantity" onChange={handleDistributionChange} required />
                        <button type="submit">Distribute</button>
                    </form>
                </div>
            )}

            {/* ✅ All Books List */}
            {activeTab === "allBooks" && (
                <div className="tab-content">
                    <h3>All Books</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Book Name</th>
                                <th>Subject</th>
                                <th>Agency</th>
                                <th>Total Books</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td>{book.book_name}</td>
                                    <td>{book.subject_id}</td>
                                    <td>{book.agency}</td>
                                    <td>{book.total_books}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default FLNBookEntry;
