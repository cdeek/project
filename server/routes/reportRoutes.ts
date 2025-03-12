import express from "express";
import { Order, User } from "../models";

const router = express.Router();

// Get Sales Report (Revenue, Orders, Best Sellers)
router.get("/sales", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    // Sales per day (Last 30 Days)
    const salesPerDay = await Order.aggregate([
      {
        $match: { createdAt: { $gte: last30Days } },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    // Sales per month (Current Year)
    const salesPerMonth = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);

    // Sales per year
    const salesPerYear = await Order.aggregate([
      {
        $group: {
          _id: { $year: "$createdAt" },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by year
    ]);

    // All-time sales
    const allTimeSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const bestSellers = await Order.aggregate([
      { $unwind: "$products" },
      { $group: { _id: "$products._id", sold: { $sum: "$products.quantity" } } },
      { $sort: { sold: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      bestSellers,
      salesPerDay,
      salesPerMonth,
      salesPerYear,
      allTimeSales
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
