import express from "express";
import { Order, User } from "../models";

const router = express.Router();

// Get Sales Report (Revenue, Orders, Best Sellers)
router.get("/sales", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Filter by date range (optional)
    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const totalRevenue = await Order.aggregate([
      { $match: filter },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } }
    ]);

    const bestSellers = await Order.aggregate([
      { $unwind: "$products" },
      { $group: { _id: "$products.productId", sold: { $sum: "$products.quantity" } } },
      { $sort: { sold: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
      totalOrders: totalRevenue[0]?.totalOrders || 0,
      bestSellers
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/customers", async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments();
    const returningCustomers = await User.countDocuments({ isReturningCustomer: true });

    res.json({
      totalCustomers,
      returningCustomers,
      retentionRate: (returningCustomers / totalCustomers) * 100
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/inventory", async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).select("name stock");
    const deadStockProducts = await Product.aggregate([
      { $lookup: { from: "orders", localField: "_id", foreignField: "products.productId", as: "sales" } },
      { $match: { sales: { $size: 0 } } },
      { $project: { name: 1, stock: 1 } }
    ]);

    res.json({
      lowStock: lowStockProducts,
      deadStock: deadStockProducts
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
}); 

router.get("/payments", async (req, res) => {
  try {
    const totalPayments = await Order.aggregate([
      { $group: { _id: "$status", totalAmount: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
    ]);

    res.json(totalPayments);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
