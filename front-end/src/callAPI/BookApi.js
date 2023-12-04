import axios from "axios"
const BookApi = {
  GetAllBooks: async () => {
    const res = await axios.get("/api/books/allbooks")
    return res.data
  },
  // http://localhost:5000/api/books/getallcate
  getAllCate: async () => {
    const res = await axios.get("/api/books/getallcate")
    return res.data
  },
  getBookbyID: async (bookID) => {
    const res = await axios.get(`/api/books/${bookID}`)
    return res.data
  },
  addBook: async (data) => {
    const res = await axios.post("/api/books/addbook", data)
    return res.data
  },
  updateBook: async (bookID, data) => {
    const res = await axios.put(`/api/books/updatebook/${bookID}`, data)
    return res.data
  },
  deleteBook: async (bookID) => {
    const res = await axios.delete(`/api/books/removebook/${bookID}`)
    return res.data
  },
}

export default BookApi;
