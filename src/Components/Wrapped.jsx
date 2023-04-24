import axios from 'axios'
import { useState, useEffect } from 'react'
import Movie from './Movie'
import Load from './Load'
import '../scss/app.scss'

export default function Wrapped() {
    const [movies, setMovies] = useState(<div className="infos">Use search to create a new request</div>)
    const [shows, setShows] = useState(<Load />)
    const [graphMovies, setGraphMovies] = useState()
    const [graphShows, setGraphShows] = useState()

    const header = {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': 'c5036d6ef235c8d7d1c0ffbc122681ee5506b633f226395458cd568bb88fce92'
    }
    const urlParams = new URLSearchParams(window.location.search)
    const username = urlParams.get('username')
    const collapse = urlParams.get('collapse') == "true" ? true : false
    const sort = {
        year: urlParams.get('year'),
        lang: urlParams.get('lang'),
        seen: urlParams.get('seen'),
        last_air_date: urlParams.get('last_air_date'),
        available: urlParams.get('available') == "true" ? true : false,
        watchlist: urlParams.get('watchlist') == "true" ? true : false,
        up_to_date: urlParams.get('up_to_date') == "true" ? true : false,
        graph: urlParams.get('graph') == "true" ? true : false,
    }

    useEffect(() => {
        if (username == null || username == "") {
            // setMovies(<></>)
            setShows(<></>)
            return
        }

        axios.get(`https://api.trakt.tv/users/${username}/ratings/movies/`, { headers: header })
        .then(res => {
            const ratings_movies = {}
            res.data.map(movie => ratings_movies[movie.movie.ids.tmdb] = movie.rating)

            axios.get(`https://api.trakt.tv/users/${username}/${sort.watchlist == true ? 'watchlist' : 'watched'}/movies`, { headers: header })
            .then(res => { setMovies(res.data.map(movie => <Movie key={movie.movie.ids.slug} data={movie} type="movie" sort={sort} setGraph={setGraphMovies} ratings={ratings_movies} />)) })
        })

        axios.get(`https://api.trakt.tv/users/${username}/ratings/shows/`, { headers: header })
        .then(res => {
            const ratings_shows = {}
            res.data.map(show => ratings_shows[show.show.ids.tmdb] = show.rating)

            console.log(ratings_shows)

            axios.get(`https://api.trakt.tv/users/${username}/${sort.watchlist == true ? 'watchlist' : 'watched'}/shows`, { headers: header })
            .then(res => { setShows(res.data.map(show => <Movie key={show.show.ids.slug} data={show} type="show" sort={sort} setGraph={setGraphShows} ratings={ratings_shows} />)) })
        })


    }, [])

    return (
    <div className="main">
        {
            sort.graph == true ?
            <div className="graph-zone">
                {graphMovies}
            </div>
            : <></>
        }
        <div className="gallerie">
            {movies}
            {collapse ? shows : <></>}
        </div>
        {
            sort.graph == true ?
            <div className="graph-zone">
                {graphShows}
            </div>
            : <></>
        }
        {
            collapse ? <></> : <div className="gallerie">
                {shows}
            </div>
        }
    </div>
    )
}