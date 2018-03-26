import React from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

const PriceHistoryGraph = ({priceHistoryList, height = 200}) => {
  return (

    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={priceHistoryList}
                 margin={{top: 10, right: 0, left: -15, bottom: 0}}>

        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="UNET" stroke="#3367d6" activeDot={{r: 8}} />
        <Line type="monotone" dataKey="CRC" stroke="#ffc658" />
        <Line type="monotone" dataKey="USD" stroke="#f04" />
      </LineChart>
    </ResponsiveContainer>

  )
};

export default PriceHistoryGraph;
