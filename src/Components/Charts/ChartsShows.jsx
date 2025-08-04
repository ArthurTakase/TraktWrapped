import { useState, useEffect } from 'react'
import { cachedData } from '../TraktImport'
import notFound from '../../assets/notFound.jpg'
import '../../scss/charts.scss'
import 'cal-heatmap/cal-heatmap.css';
import Heatmap from './Heatmap'
import { Graph, TreeGraph } from './Graph'
import { WrappedData } from '../Wrapped'

export default function ChartsShows() {
    const [genresData, setGenresData] = useState([])
    const [yearsData, setYearsData] = useState([])
    const [ratingsData, setRatingsData] = useState([])
    const [year, setYear] = useState(new Date().getFullYear())
    const [hours, setHours] = useState(0)
    const [shows, setShows] = useState(0)
    const [day, setDay] = useState('Monday')
    const [firstCountry, setFirstCountry] = useState('US')
    const [secondCountry, setSecondCountry] = useState('GB')
    const [thirdCountry, setThirdCountry] = useState('FR')
    const [topShows, setTopShows] = useState([])
    const [firstShow, setFirstShow] = useState(null)
    const [lastShow, setLastShow] = useState(null)
    const [episodes, setEpisodes] = useState(0)

    const processData = () => {
        if (!WrappedData.first_show || !WrappedData.last_show) return;

        // const genres = Object.entries(WrappedData.genres)
        //     .map(([name, value]) => ({ name, value }))
        //     .sort((a, b) => b.value - a.value)
        //     .filter(genre => genre.value > 2)
        //     .sort((a, b) => a.value - b.value)
        // setGenresData(genres)

        // const years = Object.entries(WrappedData.airing_dates)
        //     .map(([name, value]) => ({ name, value }))
        //     .sort((a, b) => b.value - a.value)
        //     .slice(0, 10)
        //     .sort((a, b) => a.name - b.name)
        // // add all yers in between the first and last year
        // if (years.length === 0) return;
        // const firstYear = parseInt(years[0].name)
        // const lastYear = parseInt(years[years.length - 1].name)
        // for (let i = firstYear; i <= lastYear; i++)
        //     if (!years.some(year => year.name === i.toString()))
        //         years.push({ name: i.toString(), value: 0 });
        // years.sort((a, b) => a.name - b.name);
        // setYearsData(years)

        // const ratings = Object.entries(WrappedData.shows_by_score)
        //     .map(([name, value]) => ({ name, value: value.length }))
        //     .sort((a, b) => b.value - a.value)
        //     .filter(rating => rating.name !== 'undefined')
        // ratings.sort((a, b) => { return a.name - b.name; });
        // setRatingsData(ratings)

        setYear(WrappedData.sort.seen)
        setShows(WrappedData.total_shows)
        setHours(Math.round(WrappedData.total_time_shows / 60))


        const byWeeks = {
            "Monday" : 0,
            "Tuesday" : 0,
            "Wednesday" : 0,
            "Thursday" : 0,
            "Friday" : 0,
            "Saturday" : 0,
            "Sunday" : 0
        }
        Object.entries(WrappedData.view_dates_shows).forEach(([date, value]) =>
            new Date(date).getFullYear() === year && (
                byWeeks[new Date(date).toLocaleString('en-US', { weekday: 'long' })] += value
            )
        );
        const mostActivity = Object.entries(byWeeks).reduce((max, current) => {
            return current[1] > max[1] ? current : max;
        });
        setDay(mostActivity[0])

        // const countries = Object.entries(WrappedData.countries).sort((a, b) => a[1].count - b[1].count).reverse()
        // setFirstCountry(countries[0][0])
        // setSecondCountry(countries[1][0])
        // setThirdCountry(countries[2][0])

        const top5 = Object.entries(WrappedData.shows_by_score)
            .flatMap(([rating, shows]) =>
                shows.map(id => {
                const show = cachedData[id];
                return {
                    rating: parseFloat(rating),
                    id,
                    title: show?.title || 'Unknown',
                    backdrop_path: show?.poster_path ? `https://image.tmdb.org/t/p/w500${show?.poster_path}` : notFound,
                };
                })
            )
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
        setTopShows(top5);

        setFirstShow(WrappedData.first_show?.data?.backdrop_path ? `https://image.tmdb.org/t/p/w500${WrappedData.first_show?.data?.backdrop_path}` : notFound)
        setLastShow(WrappedData.last_show?.data?.backdrop_path ? `https://image.tmdb.org/t/p/w500${WrappedData.last_show?.data?.backdrop_path}` : notFound)
        setEpisodes(WrappedData.total_episodes)

        console.log(WrappedData.view_dates_shows)
    }

    useEffect(() => {
        processData()
    }, [])

    return (
        <>
        <div className='charts-header charts-child child-gradient'>
            <h2>📺  My Shows data - {year}</h2>
        </div>
        <div className='charts-movies big-number charts-child'>
            <div className='big-text'>{shows}</div>
            <div className='small-text'>Shows</div>
        </div>
        <div className='charts-first movies charts-child'>
            <div className='small-text'>
                <p>First show</p>
            </div>
            <img src={firstShow} alt="space" />
        </div>
        <div className='charts-last movies charts-child'>
            <div className='small-text'>
                <p>Last show</p>
            </div>
            <img src={lastShow} alt="space" />
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
        <div className='charts-episodes big-number charts-child child-gradient'>
            <div className='big-text'>{episodes}</div>
            <div className='small-text'>Episodes</div>
        </div>
        <div className='charts-hours-shows big-number charts-child'>
            <div className='big-text'>{hours}</div>
            <div className='small-text'>Hours</div>
        </div>
        <div className='charts-day-shows big-number charts-child'>
            <div className='big-text purple-text'>{day}</div>
            <div className='small-text'>Most activity at</div>
        </div>
        <div className='charts-genres charts-child'>
            <div className='small-text title'>Top genres</div>
            <TreeGraph data={genresData} />
        </div>
        <div className='charts-top charts-child child-gradient'>
            <div className='small-text title'>Top Shows</div>
            <div className='top-movies'>
                {topShows.map((show, index) => (
                    <div className='top-movie' key={show.id}>
                        <div className='top-movie-img'>
                            <img src={show?.backdrop_path} alt="" />
                        </div>
                        <div className='top-movie-rating'>
                            <span>{show?.rating?.toFixed(0)}</span>
                            <i className='bx bxs-star'></i>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className='charts-heatmap charts-child'>
            <div className='small-text title'>Activities</div>
            <Heatmap type="episode" dates={WrappedData.view_dates_shows} first_date={WrappedData.first_show?.date} />
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