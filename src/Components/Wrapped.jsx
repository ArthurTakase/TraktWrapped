import { useState } from 'react'
import { cachedData } from './Grid'
import earth from '../assets/earth.png'
import space from '../assets/space.jpg'
import notFound from '../assets/notFound.jpg'

export const WrappedData = {
    "genres" : {},
    "actors" : {},
    "actresses" : {},
    "directors" : {},
    "countries" : {},
    "movies_by_score" : {},
    "shows_by_score" : {},
    "movies_by_score_this_year" : {},
    "shows_by_score_this_year" : {},
    "first_movie" : { "data": null, "date": null },
    "last_movie" : {  "data": null, "date": null },
    "first_show" : { "data": null, "date": null },
    "last_show" : { "data": null, "date": null },
    "total_movies" : 0,
    "total_shows" : 0,
    "total_episodes" : 0,
    "total_time_movies" : 0,
    "total_time_shows" : 0,
}

export function ClearData() {
    WrappedData.genres = {}
    WrappedData.actrors = {}
    WrappedData.actresses = {}
    WrappedData.directors = {}
    WrappedData.countries = {}
    WrappedData.first_movie.data = null
    WrappedData.first_movie.date = null
    WrappedData.last_movie.data = null
    WrappedData.last_movie.date = null
    WrappedData.first_show.data = null
    WrappedData.first_show.date = null
    WrappedData.last_show.data = null
    WrappedData.last_show.date = null
    WrappedData.total_movies = 0
    WrappedData.total_shows = 0
    WrappedData.total_episodes = 0
    WrappedData.total_time_movies = 0
    WrappedData.total_time_shows = 0
    WrappedData.movies_by_score.undefined = []
    WrappedData.shows_by_score.undefined = []
    WrappedData.movies_by_score_this_year.undefined = []
    WrappedData.shows_by_score_this_year.undefined = []
    for (let i = 0; i <= 10; i++) WrappedData.movies_by_score[i.toString()] = []
    for (let i = 0; i <= 10; i++) WrappedData.shows_by_score[i.toString()] = []
    for (let i = 0; i <= 10; i++) WrappedData.movies_by_score_this_year[i.toString()] = []
    for (let i = 0; i <= 10; i++) WrappedData.shows_by_score_this_year[i.toString()] = []
}

ClearData()

export default function Wrapped() {
    const [data, setData] = useState(0)
    const keys = Object.keys(cachedData)

    function next() {
        if (data < pages.length - 1) setData(data + 1)
    }

    function prev() {
        if (data > 0) setData(data - 1)
    }

    function randomBackdrop() {
        const index = Math.floor(Math.random() * keys.length)
        const randomElement = cachedData[keys[index]]
        return randomElement?.backdrop_path ? `https://image.tmdb.org/t/p/original${randomElement?.backdrop_path}` : randomBackdrop()
    }

    function noData(title) {
        return (
            <div className='fullpage-error fullpage'>
                <img src={randomBackdrop()} className="backdrop" />
                <p className="title">{title}</p>
                <i className='bx bx-bug'></i>
                <p>Hum, this is awkward, there is no data for this category yet.</p>
            </div>)
    }

    function transition(middleText) {
        return (
            <div className="fullpage-transition fullpage">
                <img src={randomBackdrop()} className="backdrop" />
                <p>{middleText}</p>
            </div>
        )
    }

    function countries() {
        const arr = Object.entries(WrappedData.countries).sort((a, b) => a[1].count - b[1].count).reverse()
        return (
            <div className="fullpage-countries fullpage">
                <img src={space} className="backdrop" />
                <img src={earth} className="earth" />
                <p className="title">Countries 🚀</p>
                <div className="countries">
                {
                Array.from({length: 5}, (_, i) => i).map((i) => {
                    if (!arr[i]) return <></>
                    const country = arr[i][1]
                    return (
                        <div className='country' key={i}>
                            <img src={`https://flagcdn.com/48x36/${country.data.iso_3166_1.toLowerCase()}.png`} />
                            <p>{country.data.name}</p>
                            <p>{country.count}</p>
                        </div>
                    )
                })
                }
                </div>
            </div>
        )
    }
    
    function people(from, title, className, category) {
        if (Object.keys(from).length === 0) return noData(title)
        const arr = Object.entries(from).sort((a, b) => a[1][category] - b[1][category]).reverse()

        return (
            <div className={`fullpage-people fullpage ${className}`}>
                <img src={randomBackdrop()} className="backdrop" />
                <p className="title">{title}</p>
                <div className="peoples">
                {
                Array.from({length: 5}, (_, i) => i).map((i) => {
                    if (!arr[i]) return <></>
                    return (
                        <div className='people' key={i}>
                            <img src={arr.at(i)[1]?.data?.profile_path ? `https://image.tmdb.org/t/p/original${arr.at(i)[1]?.data?.profile_path}` : notFound} />
                        </div>
                    )
                })
                }
                </div>

                <div className='peoples-data'>
                    {
                    Array.from({length: 5}, (_, i) => i).map((i) => {
                        if (!arr[i]) return <></>
                        return (
                            <div className='people-data' key={i}>
                                <p>{arr[i][1].data.name}</p>
                                {category === 'count'
                                    ? <p>{arr[i][1][category]} time(s)</p>
                                    : <p>score: {arr[i][1][category]}</p>
                                }
                            </div>
                        )
                    })
                    }
                    {
                        category !== 'count'
                        ? <div className='people-data infos'>
                            score = average rating * (number of rating / number of not rating)
                        </div>
                        : <></>
                    }
                </div>
            </div>
        )
    }

    function borne_content(from, title) {
        if (from.data === null) return noData(title)
        return (
            <div className="fullpage-movie fullpage">
                <img src={from.data?.backdrop_path ? `https://image.tmdb.org/t/p/original${from.data?.backdrop_path}` : notFound} className="backdrop" />
                <p className="title">{title}</p>
                <div className="fullmovie-content">
                    <img src={from.data?.poster_path ? `https://image.tmdb.org/t/p/w500${from.data?.poster_path}` : notFound} />
                    <h1>{from.data?.title ?? from?.data.name}</h1>
                    <p>{from?.date?.split('T')[0]}</p>
                </div>
            </div>
        )
    }

    function genres() {
        const sorted = Object.entries(WrappedData.genres).sort((a, b) => a[1] - b[1]).reverse()

        return (
            <div className="fullpage-genres fullpage">
                <img src={randomBackdrop()} className="backdrop" />
                <p className="title">Your favorite genres</p>
                <div className="circle"></div>
                <div className="genres">
                {
                Array.from({length: 5}, (_, i) => i).map((i) => {
                    if (!sorted[i]) return <></>
                    return (
                        <div className='genre' key={i}>
                            <p>{sorted[i][0]}</p>
                            <p>{sorted[i][1]}</p>
                        </div>
                    )
                })
                }
                </div>
            </div>
        )
    }

    function stats() {
        return(
            <div className="fullpage-stats fullpage">
                <img src={randomBackdrop()} className="backdrop" />
                <p className="title">Your stats 🧮</p>
                <div className="allStats">
                {
                    WrappedData.total_movies ?
                    <div className="stats">
                        <div className="subtitle">Movies</div>
                        <div className="stat">🎞 {WrappedData.total_movies} movies</div>
                        <div className="stat">⏰ {WrappedData.total_time_movies} min / ~{Math.round(WrappedData.total_time_movies / 60)} h</div>
                    </div>
                    : <></>
                }
                {
                    WrappedData.total_shows ?
                    <div className="stats">
                        <div className="subtitle">Shows</div>
                        <div className="stat">📺 {WrappedData.total_shows} shows</div>
                        <div className="stat">📼 {WrappedData.total_episodes} episodes</div>
                        <div className="stat">🕰 {WrappedData.total_time_shows} min / ~{Math.round(WrappedData.total_time_shows / 60)} h</div>
                    </div>
                    : <></>
                }
                {
                    WrappedData.total_shows && WrappedData.total_movies ?
                    <div className="stats">
                        <div className="subtitle">Total</div>
                        <div className="stat">⏱ {WrappedData.total_time_movies + WrappedData.total_time_shows} min / ~{Math.round((WrappedData.total_time_movies + WrappedData.total_time_shows) / 60)} h</div>
                    </div>
                    : <></>
                }
                </div>
            </div>
        )
    }

    function by_score(from , title) {
        if (from['10']?.length === 0) return noData(title)
        const first_backdrop = cachedData[from['10'][0]]?.backdrop_path ?? randomBackdrop()

        return (
            <div className="fullpage-score fullpage">
                <img src={`https://image.tmdb.org/t/p/original${first_backdrop}`} className="backdrop" />
                <p className="title">{title}</p>
                <div className="scores">
                {
                from['10']?.map((i) => {
                    if (cachedData[i] === undefined) return <></>
                    return (
                        <div className='score' key={i}>
                            <div className='imgZone'>
                                <img src={cachedData[i]?.poster_path ? `https://image.tmdb.org/t/p/original${cachedData[i]?.poster_path}` : notFound} />
                            </div>
                            <p>{cachedData[i].title ?? cachedData[i].name ?? cachedData[i].show?.title ?? cachedData[i].movie?.title}</p>
                        </div>
                    
                    )
                })
                }
                </div>
            </div>
        )
    }

    const pages = [
        () => transition(<>Welcome to your Trakt Wrapped! <span className='jigle'>👋</span></>),
        () => transition(<>Let's start with the <span className='stabilo red'>basics.</span></>),
        () => transition(<>You started your <span className='jigle red'>journey</span> with...</>),
        () => borne_content(WrappedData.first_movie, 'Your first movie'),
        () => borne_content(WrappedData.first_show, 'Your first show'),
        () => transition('But shows and movies are nothing without...'),
        () => people(WrappedData.actors, 'Your most watched actors 👨‍🦱', '', 'count'),
        () => people(WrappedData.actresses, 'Your most watched actresses 👩‍🦰', 'actresses', 'count'),
        () => transition('And of course...'),
        () => people(WrappedData.directors, 'Your favorite directors 👨‍🎬', 'director', 'grade'),
        () => transition(<>You traveled to <span className='stabilo red'>many places</span> around the world</>),
        countries,
        () => transition('Your adventure in the the genre-verse...'),
        () => transition(<>You explored <span className='glow red'>{Object.keys(WrappedData.genres).length}</span> different genres!</>),
        genres,
        () => transition('And now, the moment you\'ve been waiting for...'),
        () => transition(<span className='jigle'>Stats! 🧮</span>),
        stats,
        () => transition(<>What about your <span className='stabilo red'>favorite</span> movies and shows! 🤔</>),
        () => by_score(WrappedData.movies_by_score, 'Your favorite movies 💯'),
        () => by_score(WrappedData.shows_by_score, 'Your favorite shows 💯'),
        () => transition('And this year? 📆'),
        () => by_score(WrappedData.movies_by_score_this_year, 'Your favorite movies released this year ❤️'),
        () => by_score(WrappedData.shows_by_score_this_year, 'Your favorite shows released this year ❤️'),
        () => transition('Finally, your journey ends with...'),
        () => borne_content(WrappedData.last_movie, 'Your last movie'),
        () => borne_content(WrappedData.last_show, 'Your last show'),
        () => transition(<>See you in space cowboy! <span className='jigle'>🫡</span></>)
    ]

    return (
        <div className="wrapped-container active">
            <div className="body">
                {pages[data]()}
                <div className="footer">
                    <button className="before" onClick={prev}></button>
                    <button className="after" onClick={next}></button>
                    <div className='bookmarks'>
                        {
                            pages.map((_, i) => {
                                return (
                                    <div className={`bookmark ${i === data ? 'active' : ''}`} key={i} onClick={() => { setData(i) }}></div>
                                )
                            }
                            )
                        }
                    </div>
                </div>
            </div>
            <button className='close' onClick={
                () => { document.querySelector('.wrapped-container').classList.toggle('active') }
            }><i className='bx bx-x' ></i></button>
        </div>
    )
}
