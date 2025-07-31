import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Pie, Treemap, PieChart } from 'recharts';

export function Graph({ data }) {
    const CustomTooltip = ({ active, payload, label }) => {
        const isVisible = active && payload && payload.length;
        return (
            <div className="custom-tooltip" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
                {isVisible && (
                    <p className="label">{`${payload[0].payload.name} : ${payload[0].value}`}</p>
                )}
            </div>
        );
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
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
                <Tooltip content={CustomTooltip}/>
            </BarChart>
        </ResponsiveContainer>
    );
}

export function PieGraph({ data }) {
    return (
        <ResponsiveContainer width="100%" height="80%">
            <PieChart width="100%" height="80%">
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
                innerRadius={70} outerRadius={90}
                data={data}
                fill="url(#colorUv)"
                label
                />
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
}

export function TreeGraph({ data }) {
    const CustomTooltip = ({ active, payload, label }) => {
        const isVisible = active && payload && payload.length;
        return (
            <div className="custom-tooltip" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
                {isVisible && (
                    <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
                )}
            </div>
        );
    };

    return (
        <ResponsiveContainer width="100%" height="80%">
            <Treemap
                width="100%"
                height="80%"
                data={data}
                // fill="url(#colorUv)">
                fill='black'
                
                >
                {/* <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#944abe" stopOpacity={1} />
                        <stop offset="46%" stopColor="#9b45ac" stopOpacity={1} />
                        <stop offset="76%" stopColor="#bd3563" stopOpacity={1} />
                        <stop offset="100%" stopColor="#e33227" stopOpacity={1} />
                    </linearGradient>
                </defs> */}
                <Tooltip content={CustomTooltip}/>
            </Treemap>
        </ResponsiveContainer>
    );
}