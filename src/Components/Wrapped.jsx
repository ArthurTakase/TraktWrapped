import { useState } from 'react'
import { cachedData } from './Grid'

export const WrappedData = {
    "genres" : {},
    "actors" : {},
    "actresses" : {},
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

// TODO : remove this function
export function ClearData() {
    WrappedData.genres = {}
    WrappedData.actrors = {}
    WrappedData.actresses = {}
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
}

WrappedData.movies_by_score.undefined = []
WrappedData.shows_by_score.undefined = []
WrappedData.movies_by_score_this_year.undefined = []
WrappedData.shows_by_score_this_year.undefined = []
for (let i = 0; i <= 10; i++) WrappedData.movies_by_score[i.toString()] = []
for (let i = 0; i <= 10; i++) WrappedData.shows_by_score[i.toString()] = []
for (let i = 0; i <= 10; i++) WrappedData.movies_by_score_this_year[i.toString()] = []
for (let i = 0; i <= 10; i++) WrappedData.shows_by_score_this_year[i.toString()] = []
ClearData() // TODO : remove this line

export default function Wrapped() {
    const [data, setData] = useState(0)

    function next() {
        if (data < pages.length - 1) setData(data + 1)
    }

    function prev() {
        if (data > 0) setData(data - 1)
    }

    function randomBackdrop() {
        const keys = Object.keys(cachedData)
        const index = Math.floor(Math.random() * keys.length)
        const randomElement = cachedData[keys[index]]
        return randomElement.backdrop_path ?? randomBackdrop()
    }

    function noData(title) {
        return (
            <div className='fullpage-error fullpage'>
                <img src={`https://image.tmdb.org/t/p/original${randomBackdrop()}`} className="backdrop" />
                <p className="title">{title}</p>
                <i className='bx bx-bug'></i>
                <p>Hum, this is awkward, there is no data for this category yet.</p>
            </div>)
    }

    function transition(middleText) {
        return (
            <div className="fullpage-transition fullpage">
                <img src={`https://image.tmdb.org/t/p/original${randomBackdrop()}`} className="backdrop" />
                <p>{middleText}</p>
            </div>
        )
    }
    
    function people(from, title) {
        const arr = Object.entries(from).sort((a, b) => a[1].count - b[1].count)

        return (
            <div className="fullpage-people fullpage">
                <img src={`https://image.tmdb.org/t/p/original${randomBackdrop()}`} className="backdrop" />
                <p className="title">{title}</p>
                <div className="peoples">
                {
                Array.from({length: 5}, (_, i) => i).map((i) => {
                    return (
                        <div className='people' key={i}>
                            <img src={`https://image.tmdb.org/t/p/original${arr.at(-1 - i)[1].data.profile_path}`} />
                        </div>
                    )
                })
                }
                </div>

                <div className='peoples-data'>
                    {
                    Array.from({length: 5}, (_, i) => i).map((i) => {
                        return (
                            <div className='people-data' key={i}>
                                <p>{arr.at(-1 - i)[1].data.name}</p>
                                <p>{arr.at(-1 - i)[1].count} time(s)</p>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        )
    }

    function borne_content(from, title) {
        if (from.data === null) return noData(title)
        return (
            <div className="fullpage-movie fullpage">
                <img src={`https://image.tmdb.org/t/p/original${from.data?.backdrop_path}`} className="backdrop" />
                <p className="title">{title}</p>
                <div className="fullmovie-content">
                    <img src={`https://image.tmdb.org/t/p/w500${from.data?.poster_path}`} />
                    <h1>{from.data?.title ?? from?.data.name}</h1>
                    <p>{from.date.split('T')[0]}</p>
                </div>
            </div>
        )
    }

    function genres() {
        const sorted = Object.entries(WrappedData.genres).sort((a, b) => a[1] - b[1])

        return (
            <div className="fullpage-genres fullpage">
                <img src={`https://image.tmdb.org/t/p/original${randomBackdrop()}`} className="backdrop" />
                <p className="title">Your favorite genres</p>
                <div className="circle"></div>
                <div className="genres">
                {
                Array.from({length: 5}, (_, i) => i).map((i) => {
                    return (
                        <div className='genre' key={i}>
                            <p>{sorted.at(-1 - i)[0]}</p>
                            <p>{sorted.at(-1 - i)[1]}</p>
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
                <img src={`https://image.tmdb.org/t/p/original${randomBackdrop()}`} className="backdrop" />
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
        if (from['10'].length === 0) return noData(title)
        const first_backdrop = cachedData[from['10'][0]].backdrop_path

        return (
            <div className="fullpage-score fullpage">
                <img src={`https://image.tmdb.org/t/p/original${first_backdrop}`} className="backdrop" />
                <p className="title">{title}</p>
                <div className="scores">
                {
                from['10'].map((i) => {
                    if (cachedData[i] === undefined) return <div key={i}></div>
                    return (
                        <div className='score' key={i}>
                            <img src={`https://image.tmdb.org/t/p/original${cachedData[i].poster_path}`} />
                            <p>{cachedData[i].title ?? cachedData[i].name}</p>
                        </div>
                    
                    )
                })
                }
                </div>
            </div>
        )
    }

    const pages = [
        () => transition('Welcome to your Trakt Wrapped! 👋'),
        () => transition('Let\'s start with the basics.'),
        () => transition('You started your journey with...'),
        () => borne_content(WrappedData.first_movie, 'Your first movie'),
        () => borne_content(WrappedData.first_show, 'Your first show'),
        () => transition('But shows and movies are nothing without...'),
        () => people(WrappedData.actors, 'Your favorite actors 👨‍🦱'),
        () => people(WrappedData.actresses, 'Your favorite actresses 👩‍🦰'),
        () => transition('Your adventure in the genre-verse...'),
        () => transition(`You explored ${Object.keys(WrappedData.genres).length} different genres!`),
        genres,
        () => transition('And now, the moment you\'ve been waiting for...'),
        () => transition('Stats! 🧮'),
        stats,
        () => transition('What about your favorite movies and shows!'),
        () => by_score(WrappedData.movies_by_score, 'Your favorite movies 💯'),
        () => by_score(WrappedData.shows_by_score, 'Your favorite shows 💯'),
        () => transition('But what about this year?'),
        () => by_score(WrappedData.movies_by_score_this_year, 'Your favorite movies released this year ❤️'),
        () => by_score(WrappedData.shows_by_score_this_year, 'Your favorite shows released this year ❤️'),
        () => transition('And you finished your journey with...'),
        () => borne_content(WrappedData.last_movie, 'Your last movie'),
        () => borne_content(WrappedData.last_show, 'Your last show'),
        () => transition('See you in space cowboy! 🫡')
    ]

    return (
        <div className="wrapped-container active">
            <div className="body">
                {pages[data]()}
                <div className="footer">
                    <button className="before" onClick={prev}></button>
                    <button className="after" onClick={next}></button>
                </div>
            </div>
            <button className='close' onClick={
                () => { document.querySelector('.wrapped-container').classList.toggle('active') }
            }><i className='bx bx-x' ></i></button>
        </div>
    )
}
