import express from "express";

import BookCategory from "../models/BookCategory.js"


const router = express.Router();

router.post("/addcategory", async (req,res) => {
    if(req.body.isAdmin){
        try {
            console.log("dang add mot the loai");
            const newcategory = new BookCategory({
                categoryName: req.body.categoryName,
            });
            console.log(newcategory);

            const category = await newcategory.save();
            
            
            res.status(200).json(category);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
    }
});



router.get("/allcategories", async (req, res) => {
    try {
        const categories = await BookCategory.find({});
        res.status(200).json(categories);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;
