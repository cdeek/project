import express from "express";
import { Category } from "../models";
import auth from "../middleware/auth";

const router = express.Router();

// Create a Category (Admin Only)
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const { name } = req.body;
  const slug = name.toLowerCase().split(" ").join("-");

  try {
    const category = new Category({ name, slug });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Categories
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Get a Single Category
router.get("/:slug", async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) return res.status(404).json({ message: "Category not found" });

  res.json(category);
});

// Update Category (Admin Only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedCategory);
});

// Delete Category (Admin Only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
});

export default router;
