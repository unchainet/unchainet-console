import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import PropTypes from "prop-types";

const PriceHistoryGraph = ({
  priceHistoryList,
  height = 200,
  strokeWidth = 1,
  showGrid = true
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={priceHistoryList}
        margin={{ top: 10, right: 0, left: -15, bottom: 0 }}
      >
        <XAxis dataKey="name" padding={{ top: 10 }} tickMargin={8} />
        <YAxis />
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <Tooltip />
        <Legend wrapperStyle={{ paddingTop: "10px" }} />
        <Line
          type="monotone"
          dataKey="UNET"
          stroke="#3367d6"
          strokeWidth={strokeWidth}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="CRC"
          stroke="#ffc658"
          strokeWidth={strokeWidth}
        />
        <Line
          type="monotone"
          dataKey="USD"
          stroke="#f04"
          strokeWidth={strokeWidth}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
PriceHistoryGraph.propTypes = {
  strokeWidth: PropTypes.number,
  showGrid: PropTypes.bool,
  priceHistoryList: PropTypes.object,
  height: PropTypes.number
};

export default PriceHistoryGraph;
