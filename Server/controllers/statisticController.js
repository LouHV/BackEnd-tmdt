'use strict';

const Order = require("../models/oderModel");
const asyncHandler = require("express-async-handler");

const getRevenueByDay = asyncHandler(async (req, res) => {
    try {
        const day = req.params.day;
        let startDate;

        switch (day) {
            case '7':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '14':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 14);
                break;
            case '6':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 6);
                break;
            case '12':
                startDate = new Date();
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid day parameter' });
        }

        let revenueData;
        if (day === '6' || day === '12') {
            revenueData = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m", date: "$createdAt" }
                        },
                        totalRevenue: { $sum: "$total" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        time: "$_id",
                        revenue: "$totalRevenue"
                    }
                }
            ]);
        } else {
            revenueData = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        totalRevenue: { $sum: "$total" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        time: "$_id",
                        revenue: "$totalRevenue"
                    }
                }
            ]);
        }

        return res.status(200).json({
            success: true,
            data: revenueData
        });
    } catch (error) {
        throw res.status(400).json({
            success: false,
            message: "Error: " + error.message
        });
    }
});

module.exports = {
    getRevenueByDay
}
