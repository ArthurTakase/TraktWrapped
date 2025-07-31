import { useEffect } from 'react'
import '../../scss/charts.scss'
import CalHeatmap from 'cal-heatmap';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import 'cal-heatmap/cal-heatmap.css';
import { WrappedData } from '../Wrapped'

export default function Heatmap() {
    const updateHeatmap = () => {
        const convertedData = Object.keys(WrappedData.view_dates).map(date => {
            return { date: date, value: WrappedData.view_dates[date] };
        });

        const cal = new CalHeatmap();
        cal.paint({
            data: {
                source: convertedData,
                x: 'date',
                y: 'value',
                groupY: 'sum',
            },
            date: { start: new Date(WrappedData.first_movie.date) },
            considerMissingDataAsZero: true,
            // cellSize: 20,
            range: 12,
            domain: { type: 'month' },
            subDomain: { type: 'day' },
            legend: true,
            theme: "dark",
            scale: {
                color: {
                    range: ["#944abe", '#e33227'],
                    type: 'linear',
                    domain: [0, 5],
                },
            },
        },
        [[
            Tooltip, {
                text: function (timestamp, value, dayjsDate) {
                    const date = new Date(timestamp);
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    const formattedDate = date.toLocaleDateString('en-US', options);
                    if (value === 0 || value == "null" || value == null) return `${formattedDate} - no data`;
                    return `${formattedDate} - ${value} movie${value > 1 ? 's' : ''}`;
                }
            }
        ]]);
    }

    useEffect(() => {
        if (document.querySelector('#cal-heatmap').children.length > 0) return;
        updateHeatmap();
    }, [])

    return (<div id="cal-heatmap"></div>)
}