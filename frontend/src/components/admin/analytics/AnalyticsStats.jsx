import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AnalyticsStats({ title, value, change, changeType, icon: Icon, color, clickable }) {
  const isPositive = changeType === "increase";

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all ${clickable ? 'hover:ring-2 hover:ring-green-200 hover:shadow-md' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
        </div>
      </div>

      <div className="mt-4 flex items-center text-sm">
        <span
          className={`flex items-center font-medium ${isPositive ? "text-green-600" : "text-red-600"
            }`}
        >
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {change}
        </span>
        <span className="text-gray-400 ml-2">vs last month</span>
      </div>
    </div>
  );
}
