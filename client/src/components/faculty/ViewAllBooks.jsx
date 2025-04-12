import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewAllBooks = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage, setBooksPerPage] = useState(15); // Updated to show 15 books per page
    const [selectedBook, setSelectedBook] = useState(null); // For modal details
    const [showModal, setShowModal] = useState(false); // For issue confirmation modal
    const [searchFilters, setSearchFilters] = useState({
        bookId: '',
        author: '',
        category: '',
        publisher: '',
        status: '', // Added status filter
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state

    useEffect(() => {
        // Fetch books from the backend
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/faculty/books');
                setBooks(response.data);
                setFilteredBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error.response?.data?.message || error.message);
            }
        };
        fetchBooks();
    }, []);

    // Pagination logic
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleRowsPerPageChange = (e) => {
        setCurrentPage(1); // Reset to the first page
        setBooksPerPage(Number(e.target.value));
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredBooks.length / booksPerPage)) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    // Handle search filter changes
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    // Apply filters to the book list
    useEffect(() => {
        const filtered = books.filter((book) => {
            return (
                (searchFilters.bookId === '' || book.bookId.includes(searchFilters.bookId)) &&
                (searchFilters.author === '' || (book.author && book.author.toLowerCase().includes(searchFilters.author.toLowerCase()))) &&
                (searchFilters.category === '' || book.category.toLowerCase().includes(searchFilters.category.toLowerCase())) &&
                (searchFilters.publisher === '' || (book.publisher && book.publisher.toLowerCase().includes(searchFilters.publisher.toLowerCase()))) &&
                (searchFilters.status === '' || book.status === searchFilters.status)
            );
        });
        setFilteredBooks(filtered);
        setCurrentPage(1); // Reset to the first page after filtering
    }, [searchFilters, books]);

    // Handle issue confirmation
    const handleIssueBook = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/faculty/books/issue/${selectedBook.bookId}`, {
                issuedDate: new Date(), // Send the current date as the issuedDate
            });
            if (response.status === 200) {
                // Update the book's status and issuedDate in the frontend
                setBooks((prevBooks) =>
                    prevBooks.map((book) =>
                        book.bookId === selectedBook.bookId
                            ? { ...book, status: 'issued', issuedDate: new Date() }
                            : book
                    )
                );
                setFilteredBooks((prevFilteredBooks) =>
                    prevFilteredBooks.map((book) =>
                        book.bookId === selectedBook.bookId
                            ? { ...book, status: 'issued', issuedDate: new Date() }
                            : book
                    )
                );
                setShowModal(false); // Close the modal
            }
        } catch (error) {
            console.error('Error issuing book:', error.response?.data?.message || error.message);
        }
    };

    // Close sidebar when displaying the table
    useEffect(() => {
        setIsSidebarOpen(false);
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">📘 View All Books</h1>

            {/* Search Filters */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4"> {/* Updated to 5 columns */}
                <input
                    type="text"
                    name="bookId"
                    value={searchFilters.bookId}
                    onChange={handleSearchChange}
                    placeholder="Search by Book ID"
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="text"
                    name="author"
                    value={searchFilters.author}
                    onChange={handleSearchChange}
                    placeholder="Search by Author"
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="text"
                    name="category"
                    value={searchFilters.category}
                    onChange={handleSearchChange}
                    placeholder="Search by Category"
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="text"
                    name="publisher"
                    value={searchFilters.publisher}
                    onChange={handleSearchChange}
                    placeholder="Search by Publisher"
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                    name="status"
                    value={searchFilters.status}
                    onChange={handleSearchChange}
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="issued">Issued</option>
                </select>
            </div>

            {/* Book List */}
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">Book ID</th>
                            <th className="border border-gray-300 px-4 py-2">Title</th>
                            <th className="border border-gray-300 px-4 py-2">Author</th>
                            <th className="border border-gray-300 px-4 py-2">Category</th>
                            <th className="border border-gray-300 px-4 py-2">Publisher</th> {/* Added Publisher Column */}
                            <th className="border border-gray-300 px-4 py-2">Availability</th>
                            <th className="border border-gray-300 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBooks.map((book) => (
                            <tr key={book.bookId} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2">{book.bookId}</td>
                                <td className="border border-gray-300 px-4 py-2">{book.title}</td>
                                <td className="border border-gray-300 px-4 py-2">{book.author}</td>
                                <td className="border border-gray-300 px-4 py-2">{book.category}</td>
                                <td className="border border-gray-300 px-4 py-2">{book.publisher || 'N/A'}</td> {/* Display Publisher */}
                                <td className="border border-gray-300 px-4 py-2">
                                    {book.status === 'available' ? (
                                        <span className="text-green-600 font-bold">Available</span>
                                    ) : (
                                        <span className="text-red-600 font-bold">Issued</span>
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {book.status === 'available' ? (
                                        <button
                                            onClick={() => {
                                                setSelectedBook(book);
                                                setShowModal(true);
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Issue
                                        </button>
                                    ) : (
                                        <span className="text-gray-500">
                                            Expected Return: {new Date(book.issuedDate).setDate(new Date(book.issuedDate).getDate() + 5) ? new Date(new Date(book.issuedDate).setDate(new Date(book.issuedDate).getDate() + 5)).toLocaleDateString() : 'N/A'}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredBooks.length > 0 && (
                <div className="flex justify-end items-center mt-4">
                    <span className="mr-2">Rows per page:</span>
                    <select
                        value={booksPerPage}
                        onChange={handleRowsPerPageChange}
                        className="border border-gray-300 rounded px-2 py-1"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                    <span className="mx-4">
                        {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, filteredBooks.length)} of {filteredBooks.length}
                    </span>
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600'}`}
                    >
                        &lt;
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === Math.ceil(filteredBooks.length / booksPerPage)}
                        className={`px-3 py-1 border rounded ml-2 ${
                            currentPage === Math.ceil(filteredBooks.length / booksPerPage) ? 'text-gray-400' : 'text-blue-600'
                        }`}
                    >
                        &gt;
                    </button>
                </div>
            )}

            {/* Issue Confirmation Modal */}
            {showModal && selectedBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Confirm Issue</h2>
                        <p>Are you sure you want to issue <strong>{selectedBook.title}</strong>?</p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleIssueBook}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Yes, Issue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewAllBooks;