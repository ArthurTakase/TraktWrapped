import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from "react-chartjs-2";
import '../scss/graph.scss'


ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Data_Genre_Movies = {}
export const Data_Genre_Shows = {}

export default function Graph({ data }) {
    const sortable = Object.fromEntries( Object.entries(data).sort(([,a],[,b]) => b-a) )

    const options = {
        indexAxis: 'x',
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            display: false
          }
        },
      };

    const d_genre = {
        labels: Object.keys(sortable),
        datasets: [{
            data: Object.values(sortable),
            hoverOffset: 100,
            borderWidth: 0,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)'
            ]
        }]
    }

    const best_genre = Object.keys(sortable)[0]

    return (
        <div className="graph">
            <div className="canvas">
                <Bar data={d_genre} options={options} />
                {/* <h1>Data by Genre</h1> */}
                <h1><span className="accent">{best_genre}</span> semble être votre préférence</h1>
            </div>
        </div>
    )
}