import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Pie, PieChart } from 'recharts';

export function Graph({ data }) {

    console.log("Graph data:", data);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#944abe" stopOpacity={1} />
                        <stop offset="46%" stopColor="#9b45ac" stopOpacity={1} />
                        <stop offset="76%" stopColor="#bd3563" stopOpacity={1} />
                        <stop offset="100%" stopColor="#e33227" stopOpacity={1} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value" fill="url(#colorUv)" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function PieGraph({ data }) {

    console.log("Graph data:", data);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart width="100%" height="600px">
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#944abe" stopOpacity={1} />
                        <stop offset="46%" stopColor="#9b45ac" stopOpacity={1} />
                        <stop offset="76%" stopColor="#bd3563" stopOpacity={1} />
                        <stop offset="100%" stopColor="#e33227" stopOpacity={1} />
                    </linearGradient>
                </defs>
                <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={data}
                fill="url(#colorUv)"
                label
                />
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
}