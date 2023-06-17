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
        return randomElement?.backdrop_path
    }

    function noData(title) {
        return (
            <div className='fullpage-error'>
                <img src={`https://image.tmdb.org/t/p/original${randomBackdrop()}`} className="backdrop" />
                <p className="title">{title}</p>
                <i class='bx bx-bug'></i>
                <p>Hum, this is awkward, there is no data for this category yet.</p>
            </div>)
    }
    
    function people(from, title) {
        const arr = Object.entries(from).sort((a, b) => a[1].count - b[1].count)

        return (
            <div className="fullpage-people">
                <img src={`https://image.tmdb.org/t/p/original${randomBackdrop()}`} className="backdrop" />
                <p className="title">{title}</p>
                <div className="fullpage-people">
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
                                <p>{arr.at(-1 - i)[1].count} contents</p>
                            </div>
                        )
                    })
                    }
                    </div>
                </div>
            </div>
        )
    }

    function borne_content(from, title) {
        if (from.data === null) return noData(title)
        return (
            <div className="fullpage-movie">
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
        return <>Genres</>
    }

    function stats() {
        return <>Stats</>
    }

    function movies_by_score() {
        return <>Movies by score</>
    }

    function shows_by_score() {
        return <>Shows by score</>
    }

    function movies_by_score_this_year() {
        return <>Movies by score this year</>
    }

    function shows_by_score_this_year() {
        return <>Shows by score this year</>
    }

    const pages = [
        () => borne_content(WrappedData.first_movie, 'Your first movie'),
        () => borne_content(WrappedData.first_show, 'Your first show'),
        () => people(WrappedData.actors, 'Your favorite actors'),
        () => people(WrappedData.actresses, 'Your favorite actresses'),
        // genres,
        // stats,
        // movies_by_score,
        // shows_by_score,
        // movies_by_score_this_year,
        // shows_by_score_this_year,
        () => borne_content(WrappedData.last_movie, 'Your last movie'),
        () => borne_content(WrappedData.last_show, 'Your last show'),
    ]

    return (
        <div className="wrapped-container">
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
