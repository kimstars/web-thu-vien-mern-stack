import express from "express"
import Book from "../models/Book.js"
import BookTransaction from "../models/BookTransaction.js"
import router from "./books.js"



router.post("/add-transaction", async (req, res) => {
    try{

        if(req.body.isAdmin === true){
            console.log("co giao dich!!")
            const newtran = await new BookTransaction({
                bookId: req.body.bookId,
                borrowerId: req.body.borrowerId,
                bookName: req.body.bookName,
                borrowerName: req.body.borrowerName,
                transactionType: req.body.transactionType,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate
            })
            console.log(newtran);
            const transaction = await newtran.save();
            
            res.status(200).json(transaction);

        }else{

            res.status(500).json("You aren't allowed to add a Transaction");

        }
    }catch(err){
        res.status(504).json(err);

    }
})


router.get("/all-transactions", async (req,res) => {
    try {
        const transactions = await BookTransaction.find({}).populate("borrowerId").sort({_id:-1});
        res.status(200).json(transactions);
    }catch (err){
        return res.status(500).json(err);
    }
})


router.put("/update-transaction/:id", async (req, res) => {
    try {
        if (req.body.isAdmin) {
            await BookTransaction.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Transaction details updated successfully");
        }
    }
    catch (err) {
        res.status(504).json(err)
    }
})

router.delete("/remove-transaction/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const data = await BookTransaction.findByIdAndDelete(req.params.id);
            const book = Book.findById(data.bookId)
            console.log(book)
            await book.updateOne({ $pull: { transactions: req.params.id } })
            res.status(200).json("Transaction deleted successfully");
        } catch (err) {
            return res.status(504).json(err);
        }
    } else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

export default router;