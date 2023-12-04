import express from "express"
import Book from "../models/Book.js"
import BookCategory from "../models/BookCategory.js"

const router = express.Router()

/* Get all books in the db */
router.get("/allbooks", async (req, res) => {
    try {
        console.log("co em get all books");
        const books = await Book.find({}).populate("transactions").sort({ _id: -1 })
        res.status(200).json(books)
    }
    catch (err) {
        return res.status(504).json(err);
    }
})


router.get("/get20book", async (req, res) => {
    try {
        console.log("co em get all books");
        const books = await Book.find({}).populate("transactions").sort({ _id: -1 }).limit(20)
        res.status(200).json(books)
    }
    catch (err) {
        return res.status(504).json(err);
    }
})



/* Get Book by book Id */
router.get("/getbook/:id", async (req, res) => {
    try {
        console.log("lay mot dau sach", req.params.id);
        const book = await Book.findById(req.params.id).populate("transactions")
        res.status(200).json(book)
    }
    catch {
        return res.status(500).json(err)
    }
})


/* Get Book by category name */
router.get("/getallcate", async (req, res) => {
    try {
        console.log("herre")
        const categories = await Book.distinct("categories");
        res.status(200).json(categories)
    }
    catch (err){
        return res.status(500).json(err)
    }
})


/* Get Book by category name */
router.get("/getbycate/:cateName", async (req, res) => {
    try {
        console.log("lay theo the loai", req.params.cateName);
        const book = await Book.find({ categories: req.params.cateName });
        res.status(200).json(book)
    }
    catch (err){
        return res.status(500).json(err)
    }
})
/* Search Book by keyword */

router.get("/search/:keyword", async (req, res) => {
    try {
        const searchTerm  = req.params.keyword;
        console.log("tim kiem ", req.params.keyword)

        // Tìm kiếm các cuốn sách với tên chứa từ khóa tìm kiếm
        const books = await Book.find({
            bookName: { $regex: req.params.keyword, $options: "i" },
        });
        res.status(200).json(books);
    }
    catch (err){
        return res.status(500).json(err)
    }
})


/* Adding book */
router.post("/addbook", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const newbook = await new Book({
                bookName: req.body.bookName,
                description: req.body.description,
                author: req.body.author,
                bookCountAvailable: req.body.bookCountAvailable,
                language: req.body.language,
                publisher: req.body.publisher,
                bookStatus: req.body.bookSatus,
                categories: req.body.categories,
                image_url: req.body.image_url,
            })
            console.log("add 1 cuon sach => ", newbook)
            const book = await newbook.save()
            // await BookCategory.updateMany({ '_id': book.categories }, { $push: { books: book._id } });
            res.status(200).json(book)
        }
        catch (err) {
            res.status(504).json(err)
            console.log(err);
        }
    }
    else {
        return res.status(403).json("You dont have permission to add a book!");
    }
})

/* Addding book */
router.put("/updatebook/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            await Book.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Book details updated successfully");
        }
        catch (err) {
            res.status(504).json(err);
        }
    }
    else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

/* Remove book  */
router.delete("/removebook/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const book = await Book.findOneAndDelete(req.params.id);
        console.log("Xoa",book)
        // await book.remove()
        // await BookCategory.updateMany({ '_id': book.categories }, { $pull: { books: book._id } });
        res.status(200).json("Book has been deleted");
    } catch (err) {
        return res.status(504).json(err);
    }
   
})

export default router