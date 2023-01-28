import axios from 'axios'
import { useState, useEffect } from 'react'
import Movie from './Movie'
import Load from './Load'
import '../scss/app.scss'

export default function Wrapped() {
    const [movies, setMovies] = useState(<Load />)
    const [shows, setShows] = useState(<Load />)
    const [graphMovies, setGraphMovies] = useState()
    const [graphShows, setGraphShows] = useState()
    const [watch, setWatch] = useState("watched")

    const header = {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': 'c5036d6ef235c8d7d1c0ffbc122681ee5506b633f226395458cd568bb88fce92'
    }
    const urlParams = new URLSearchParams(window.location.search)
    const username = urlParams.get('username')
    const sort = {
        year: urlParams.get('year') == "" ? null : urlParams.get('year'),
        up_to_date: urlParams.get('up_to_date') == "true" ? true : urlParams.get('up_to_date') == "false" ? false : null,
        last_air_date: urlParams.get('last_air_date') == "" ? null : urlParams.get('last_air_date'),
        lang: urlParams.get('lang') == null ? "fr-FR" : urlParams.get('lang'),
        available: urlParams.get('available') == "true" ? true : urlParams.get('available') == "false" ? false : null,
        watchlist: urlParams.get('watchlist') == "true" ? true : urlParams.get('watchlist') == "false" ? false : null,
        graph: urlParams.get('graph') == "true" ? true : urlParams.get('graph') == "false" ? false : null,
        seen: urlParams.get('seen') == "" ? null : urlParams.get('seen')
    }

    console.log(sort)

    useEffect(() => {
        if (sort.watchlist == true) { setWatch("watchlist") }
        if (username == null) {
            setMovies(<></>)
            setShows(<></>)
            return
        }

        axios.get(`https://api.trakt.tv/users/${username}/${watch}/movies`, { headers: header })
        .then(res => { setMovies(res.data.map(movie => <Movie key={movie.movie.ids.slug} data={movie} type="movie" sort={sort} setGraph={setGraphMovies} />)) })

        axios.get(`https://api.trakt.tv/users/${username}/${watch}/shows`, { headers: header })
        .then(res => { setShows(res.data.map(show => <Movie key={show.show.ids.slug} data={show} type="show" sort={sort} setGraph={setGraphShows} />)) })
    }, [])

    return (
    <div className="main">
        <div className="graph-zone">
            {sort.graph == true ? graphMovies : <></>}
        </div>
        <div className="gallerie">
            {movies}
        </div>
        <div className="graph-zone">
            {sort.graph == true ? graphShows : <></>}
        </div>
        <div className="gallerie">
            {shows}
        </div>
    </div>
    )
}