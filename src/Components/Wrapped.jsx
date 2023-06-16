import { useState, useEffect } from 'react'

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

export function printData() {
    // console.table(WrappedData.genres)
    // console.table(WrappedData.actors)
    // console.table(WrappedData.actresses)
    console.table(WrappedData.movies_by_score)
    console.table(WrappedData.shows_by_score)
    console.table(WrappedData.movies_by_score_this_year)
    console.table(WrappedData.shows_by_score_this_year)
    console.log(`First movie: ${WrappedData.first_movie.data?.title} (${WrappedData.first_movie.data?.last_updated_at_trakt.split('T')[0]})`)
    console.log(`Last movie: ${WrappedData.last_movie.data?.title} (${WrappedData.last_movie.data?.last_updated_at_trakt.split('T')[0]})`)
    console.log(`First show: ${WrappedData.first_show.data?.name} (${WrappedData.first_show.data?.last_updated_at_trakt.split('T')[0]})`)
    console.log(`Last show: ${WrappedData.last_show.data?.name} (${WrappedData.last_show.data?.last_updated_at_trakt.split('T')[0]})`)
    console.log('Total movies: ', WrappedData.total_movies)
    console.log('Total shows: ', WrappedData.total_shows)
    console.log('Total episodes: ', WrappedData.total_episodes)
    console.log('Total time movies: ', WrappedData.total_time_movies)
    console.log('Total time shows: ', WrappedData.total_time_shows)
    console.log('Total time: ', WrappedData.total_time_movies + WrappedData.total_time_shows)
}

export default function Wrapped() {
    
    function actors() {
        return <>Actors</>
    }

    function actresses() {
        return <>Actresses</>
    }

    function genres() {
        return <>Genres</>
    }

    function borne_content(from, title) {
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
    
    const [data, setData] = useState(0)
    const pages = [
        () => borne_content(WrappedData.first_movie, 'Votre premier film'),
        () => borne_content(WrappedData.first_show, 'Votre première série'),
        // actors,
        // actresses,
        // genres,
        () => borne_content(WrappedData.last_movie, 'Votre dernier film'),
        () => borne_content(WrappedData.last_show, 'Votre dernière série'),
        // stats,
        // movies_by_score,
        // shows_by_score,
        // movies_by_score_this_year,
        // shows_by_score_this_year,
    ]

    return (
        <div className="wrapped-container">
            <div className="body">
                {pages[data]()}
                <div className="footer">
                    <button className="before" onClick={
                        () => { if (data > 0) setData(data - 1) }
                    }></button>
                    <button className="after" onClick={
                        () => { if (data < pages.length - 1) setData(data + 1) }
                    }></button>
                </div>
            </div>
            <button className='close' onClick={
                () => { window.location.reload() }
            }><i className='bx bx-x' ></i></button>
        </div>
    )
}
