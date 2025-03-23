'use client';

import React, { useState } from "react";

import {
  LineChart,
  Line,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AnalyticsChart = ({ salesData }) => {
  const [filteredData, setFilteredData] = useState(salesData["salesPerMonth"]);
  const [selectedOption, setSelectedOption] = useState("salesPerMonth");

  const handleSelectChange = (e) => {
    setSelectedOption(e);
    setFilteredData(salesData[e]);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Views {selectedOption}</CardDescription>
          <Select onValueChange={handleSelectChange} defaultValue="salesPerMonth">
          <SelectTrigger className="w-96 h-8">
            <SelectValue placeholder="Select by time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="salesPerDay">
                Daily sales
              </SelectItem>
              <SelectItem value="salesPerMonth">
                Monthly sales
              </SelectItem>
              <SelectItem value="salesPerYear">
                yearly sales
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        </CardHeader>
        <CardContent>
         <ResponsiveContainer width="100%" height={350}>
          <BarChart data={filteredData}>
           <CartesianGrid strokeDasharray="3 3" />
           <XAxis
            dataKey="_id"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
           />
           <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
           />
           <Tooltip />
           <Legend />
           <Bar
            dataKey="totalRevenue"
            name="Revenue"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
           />
           <Bar
            dataKey="totalOrders"
            name="Orders"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
           />
          </BarChart>
         </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  ); 
}

export default AnalyticsChart;

