import express from "express";
import jwt from "jsonwebtoken";
import upload from "../middleware/upload"; 
import auth from "../middleware/auth.ts";
import { Product } from "../models";

const router = express.Router();

router.post('/', auth, upload.fields([
    { name: "images", maxCount: 4 },
    { name: "video", maxCount: 1 },
  ]), async (req, res) => {
  // Empty fields validation 
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  const { title, description, price, category,keywords } = req.body;
  
  try {
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) return;

    const images = (req.files as { [fieldname: string]: Express.Multer.File[] }["images"] || []).map(
        (file) => file.path
    );
    const video = (req.files as { [fieldname: string]: Express.Multer.File[] }["video"] || [])[0]?.path || null;

    const newProduct = new Product({ 
     title, 
     description, 
     price,
     category,
     keywords,
     images,
     video,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully"});
  } catch (error) {
     res.status(400).json({message: error});
  }
}); 

// Get All Products
router.get("/", async (req, res) => {
  try {
    let { page, limit, search, category, minPrice, maxPrice, sort } = req.query;

    page = parseInt(page) || 1;  // Default page 1
    limit = parseInt(limit) || 10; // Default 10 items per page
    const skip = (page - 1) * limit;

    const filter = {};

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Sorting (price, name, createdAt)
    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split("_"); // e.g., "price_desc"
      sortOptions[field] = order === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default: newest first
    }

    // Fetch products with filters, sorting, and pagination
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("category"); // Populate category details

    const total = await Product.countDocuments(filter); // Total count for pagination

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Product
router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug });
  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
});

// Update Product (Admin Only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
});

// Update product stock
router.put("/:id/stock", auth, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    const { stock } = req.query;

    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.stock = stock;
        await product.save();
        res.json({ message: "Stock updated successfully", product });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Product (Admin Only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});  

export default router;
