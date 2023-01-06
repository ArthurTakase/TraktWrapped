import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from "react-chartjs-2";
import '../scss/graph.scss'

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Data_Genre_Movies = {}
export const Data_Genre_Shows = {}
export const All_Movies = []
export const All_Shows = []

export default function Graph({ type }) {
    const data = type == "movie" ? Data_Genre_Movies : Data_Genre_Shows
    const number = type == "movie" ? All_Movies.length : All_Shows.length
    const type_fr = type == "movie" ? "films" : "séries"
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
                'red'
            ]
        }]
    }

    return (
      <div className="group">
        <h1 className="title">Statistiques des {type_fr}</h1>
        <div className="col-1">
          <div className="graph">
              <div className="canvas">
                  <Bar data={d_genre} options={options} />
              </div>
          </div>
        </div>
        <div className="col-2">
          <div>Vous avez vu <span className="accent">{number}</span> {type_fr}</div>
          <div>Votre genre favori est <span className="accent">{Object.keys(sortable)[0]}</span></div>
        </div>
      </div>
    )
}