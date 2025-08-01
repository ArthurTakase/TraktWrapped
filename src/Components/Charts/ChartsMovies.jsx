import { useState, useEffect } from 'react'
import { cachedData } from '../TraktImport'
import notFound from '../../assets/notFound.jpg'
import '../../scss/charts.scss'
import 'cal-heatmap/cal-heatmap.css';
import Heatmap from './Heatmap'
import { Graph, TreeGraph } from './Graph'
import { WrappedData } from '../Wrapped'

export default function ChartsMovies() {
    const [genresData, setGenresData] = useState([])
    const [yearsData, setYearsData] = useState([])
    const [ratingsData, setRatingsData] = useState([])
    const [year, setYear] = useState(new Date().getFullYear())
    const [hours, setHours] = useState(0)
    const [movies, setMovies] = useState(0)
    const [day, setDay] = useState('Monday')
    const [firstCountry, setFirstCountry] = useState('US')
    const [secondCountry, setSecondCountry] = useState('GB')
    const [thirdCountry, setThirdCountry] = useState('FR')
    const [topFilms, setTopFilms] = useState([])
    const [firstMovie, setFirstMovie] = useState(null)
    const [lastMovie, setLastMovie] = useState(null)

    const processData = () => {
        if (!WrappedData.first_movie || !WrappedData.last_movie) return;

        const genres = Object.entries(WrappedData.genres)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .filter(genre => genre.value > 2)
            .sort((a, b) => a.value - b.value)
        setGenresData(genres)

        const years = Object.entries(WrappedData.airing_dates)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10)
            .sort((a, b) => a.name - b.name)
        // add all yers in between the first and last year
        if (years.length === 0) return;
        const firstYear = parseInt(years[0].name)
        const lastYear = parseInt(years[years.length - 1].name)
        for (let i = firstYear; i <= lastYear; i++)
            if (!years.some(year => year.name === i.toString()))
                years.push({ name: i.toString(), value: 0 });
        years.sort((a, b) => a.name - b.name);
        setYearsData(years)

        const ratings = Object.entries(WrappedData.movies_by_score)
            .map(([name, value]) => ({ name, value: value.length }))
            .sort((a, b) => b.value - a.value)
            .filter(rating => rating.name !== 'undefined')
        ratings.sort((a, b) => { return a.name - b.name; });
        setRatingsData(ratings)

        setYear(WrappedData.sort.seen)
        setMovies(WrappedData.total_movies)
        setHours(Math.round(WrappedData.total_time_movies / 60))

        const mostActivity = Object.entries(WrappedData.by_week).reduce((max, current) => {
            return current[1] > max[1] ? current : max;
        });
        setDay(mostActivity[0])

        const countries = Object.entries(WrappedData.countries).sort((a, b) => a[1].count - b[1].count).reverse()
        setFirstCountry(countries[0][0])
        setSecondCountry(countries[1][0])
        setThirdCountry(countries[2][0])

        const top5 = Object.entries(WrappedData.movies_by_score)
            .flatMap(([rating, movies]) =>
                movies.map(id => {
                const movie = cachedData[id];
                return {
                    rating: parseFloat(rating),
                    id,
                    title: movie?.title || 'Unknown',
                    backdrop_path: movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie?.poster_path}` : notFound,
                };
                })
            )
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
        setTopFilms(top5);

        setFirstMovie(WrappedData.first_movie?.data?.backdrop_path ? `https://image.tmdb.org/t/p/w500${WrappedData.first_movie?.data?.backdrop_path}` : notFound)
        setLastMovie(WrappedData.last_movie?.data?.backdrop_path ? `https://image.tmdb.org/t/p/w500${WrappedData.last_movie?.data?.backdrop_path}` : notFound)
    }

    useEffect(() => {
        processData()
    }, [])

    return (
        <>
        <div className='charts-header charts-child child-gradient'>
            <h2>🎥  My movies data - {year}</h2>
        </div>
        <div className='charts-movies big-number charts-child'>
            <div className='big-text'>{movies}</div>
            <div className='small-text'>Movies</div>
        </div>
        <div className='charts-first movies charts-child'>
            <div className='small-text'>
                <p>First movie</p>
            </div>
            <img src={firstMovie} alt="space" />
        </div>
        <div className='charts-last movies charts-child'>
            <div className='small-text'>
                <p>Last movie</p>
            </div>
            <img src={lastMovie} alt="space" />
        </div>
        <div className='charts-countries charts-child'>
            <div className='small-text title'>Top countries</div>
            <div className='podium'>
                <div className='podium-second'>
                    <img src={`https://flagcdn.com/48x36/${secondCountry.toLowerCase()}.png`} />
                    <p>2</p>
                    <span>{WrappedData.countries[secondCountry]?.count}</span>
                </div>
                <div className='podium-first'>
                    <img src={`https://flagcdn.com/48x36/${firstCountry.toLowerCase()}.png`} />
                    <p>1</p>
                    <span>{WrappedData.countries[firstCountry]?.count}</span>
                </div>
                <div className='podium-third'>
                    <img src={`https://flagcdn.com/48x36/${thirdCountry.toLowerCase()}.png`} />
                    <p>3</p>
                    <span>{WrappedData.countries[thirdCountry]?.count}</span>
                </div>
            </div>
        </div>
        <div className='charts-hours big-number charts-child child-gradient'>
            <div className='big-text'>{hours}</div>
            <div className='small-text'>Hours</div>
        </div>
        <div className='charts-day big-number charts-child'>
            <div className='big-text purple-text'>{day}</div>
            <div className='small-text'>Most activity at</div>
        </div>
        <div className='charts-genres charts-child'>
            <div className='small-text title'>Top genres</div>
            <TreeGraph data={genresData} />
        </div>
        <div className='charts-top charts-child child-gradient'>
            <div className='small-text title'>Top movies</div>
            <div className='top-movies'>
                {topFilms.map((movie, index) => (
                    <div className='top-movie' key={movie.id}>
                        <div className='top-movie-img'>
                            <img src={movie?.backdrop_path} alt="" />
                        </div>
                        <div className='top-movie-rating'>
                            <span>{movie?.rating?.toFixed(0)}</span>
                            <i className='bx bxs-star'></i>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className='charts-heatmap charts-child'>
            <div className='small-text title'>Activities</div>
            <Heatmap />
        </div>
        <div className='charts-credits charts-child child-gradient'>
            <div className='small-text'><i className='bx bx-link'></i> arthurtakase.github.io</div>
        </div>
        <div className='charts-releases charts-child'>
            <div className='small-text title'>Releases</div>
            <Graph data={yearsData} />
        </div>
        <div className='charts-ratings charts-child'>
            <div className='small-text title'>Ratings</div>
            <Graph data={ratingsData} />
        </div>
        </>
    )
}