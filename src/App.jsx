import axios from 'axios'
import { useState, useEffect } from 'react'
import Movie from './Components/Movie'
import Load from './Components/Load'
import './scss/app.scss'
import Graph from './Components/Chart'

function App() {
    const [movies, setMovies] = useState(<Load />)
    const [shows, setShows] = useState(<Load />)
    const [graphMovies, setGraphMovies] = useState(<Load />)
    const [graphShows, setGraphShows] = useState(<Load />)
    const [watch, setWatch] = useState("watched")
    const header = {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': 'c5036d6ef235c8d7d1c0ffbc122681ee5506b633f226395458cd568bb88fce92'
    }
    const urlParams = new URLSearchParams(window.location.search)
    const username = urlParams.get('username')
    const sort = {
        year: urlParams.get('year'),
        up_to_date: urlParams.get('up_to_date') == "true" ? true : urlParams.get('up_to_date') == "false" ? false : null,
        last_air_date: urlParams.get('last_air_date'),
        lang: urlParams.get('lang') == null ? "fr-FR" : urlParams.get('lang'),
        available: urlParams.get('available') == "true" ? true : urlParams.get('available') == "false" ? false : null,
        watchlist: urlParams.get('watchlist') == "true" ? true : urlParams.get('watchlist') == "false" ? false : null,
        graph: urlParams.get('graph') == "true" ? true : urlParams.get('graph') == "false" ? false : null,
    }

    useEffect(() => {
        console.log(sort)
        if (sort.watchlist == true) { setWatch("watchlist") }

        axios.get(`https://api.trakt.tv/users/takaaase_/${watch}/movies`, { headers: header })
        .then(res => { setMovies(res.data.map(movie => <Movie key={movie.movie.ids.slug} data={movie} type="movie" sort={sort} setGraph={setGraphMovies} />)) })

        axios.get(`https://api.trakt.tv/users/takaaase_/${watch}/shows`, { headers: header })
        .then(res => { setShows(res.data.map(show => <Movie key={show.show.ids.slug} data={show} type="show" sort={sort} setGraph={setGraphShows} />)) })
    }, [])

    return (<>
        <div className="infos">
            <div className="bigTitle">
                <p>{username}</p>
                {/* <p>Trakt Review</p> */}
            </div>
            <div className="query">
                {sort.year != null && <p>Year: {sort.year}</p>}
                {sort.up_to_date != null && <p>Up to date: {sort.up_to_date ? "Yes" : "No"}</p>}
                {sort.last_air_date != null && <p>Last air date: {sort.last_air_date}</p>}
                {sort.lang != null && <p>Language: {sort.lang}</p>}
                {sort.available != null && <p>Available: {sort.available ? "Yes" : "No"}</p>}
                {sort.watchlist != null && <p>Watchlist: {sort.watchlist ? "Yes" : "No"}</p>}
                {sort.graph != null && <p>Graph: {sort.graph ? "Yes" : "No"}</p>}
            </div>
        </div>
        <h1 className='title-zone'>Films</h1>
        {sort.graph == true ? graphMovies : <></>}
        <div className="gallerie">
            {movies}
        </div>
        <h1 className='title-zone'>Séries</h1>
        {sort.graph == true ? graphShows : <></>}
        <div className="gallerie">
            {shows}
        </div>
    </>)
}

export default App
