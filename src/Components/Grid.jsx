import Content from './Content'
import Load from './Load'
import { TraktDB } from './IndexedDB'
import '../scss/app.scss'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { ClearData } from "./Wrapped"

export let cachedData = {}

async function getMovieData(username, type, sort, headers, setLoadInfos, cachedData, start, end) {
    setLoadInfos(<Load info="(2/7) Loading movies ratings" />)
    const response = await axios.get(`https://api.trakt.tv/users/${username}/ratings/movies/`, { headers })
    const ratingsMovies = response.data.reduce((acc, movie) => {
        acc[movie.movie.ids.tmdb] = movie.rating
        return acc
    }, {})

    setLoadInfos(<Load info="(3/7) Loading movies data from trakt" />)
    const responseInfos = await axios.get(`https://api.trakt.tv/users/${username}/${type}/movies`, { headers })
    const date_start = new Date(start)
    const date_end = new Date(end)
    const movies = responseInfos.data.reduce((acc, movie) => {
        if (new Date(movie.last_watched_at) < date_start) return acc
        if (new Date(movie.last_watched_at) > date_end) return acc
        acc[movie.movie.ids.tmdb] = movie
        return acc
    }, {})

    setLoadInfos(<Load info="(4/7) Loading movies datas from tmdb" />)
    const moviesDatas = {}
    for (const movie in movies) {
        if (cachedData[movie] && cachedData[movie].last_updated_at_trakt === movies[movie].last_updated_at) {
            moviesDatas[movie] = cachedData[movie]
            continue
        }

        try {
            const responseTMDB = await axios.get(`https://api.themoviedb.org/3/movie/${movie}?api_key=29e2619a94b2f9dd0ca5609beac3eeda&language=${sort.lang}&append_to_response=releases,credits`)
            const data = {
                ...responseTMDB.data,
                last_updated_at_trakt: movies[movie].last_updated_at
            }
            moviesDatas[movie] = data
            cachedData[movie] = data
            await TraktDB.addToDB(movie, data)
            setLoadInfos(<Load info="(4/7) Loading movies datas from tmdb" moreInfo={responseTMDB.data.title} />)
        } catch (e) { console.log(`Erreur dans le chargement de ${movies[movie].movie.title}`) }
    }

    return { ratingsMovies, movies, moviesDatas }
}

async function getShowData(username, type, sort, headers, setLoadInfos, cachedData, start, end) {
    setLoadInfos(<Load info="(5/7) Loading shows ratings" />)
    const responseRating = await axios.get(`https://api.trakt.tv/users/${username}/ratings/shows/`, { headers })
    const ratingsShows = responseRating.data.reduce((acc, show) => {
        acc[show.show.ids.tmdb] = show.rating
        return acc
    }, {})

    setLoadInfos(<Load info="(6/7) Loading shows data from trakt" />)
    const responseInfos = await axios.get(`https://api.trakt.tv/users/${username}/${type}/shows`, { headers })
    const date_start = new Date(start)
    const date_end = new Date(end)
    const shows = responseInfos.data.reduce((acc, show) => {
        if (new Date(show.last_watched_at) < date_start) return acc
        if (new Date(show.last_watched_at) > date_end) return acc
        acc[show.show.ids.tmdb] = show
        return acc
    }, {})

    setLoadInfos(<Load info="(7/7) Loading shows datas from tmdb" />)
    const showsDatas = {}
    for (const show in shows) {
        if (cachedData[show] && cachedData[show].last_updated_at_trakt === shows[show].last_updated_at) { 
            showsDatas[show] = cachedData[show]
            cachedData[show] = showsDatas[show]
            continue
        }

        try {
            const responseTMDB = await axios.get(`https://api.themoviedb.org/3/tv/${show}?api_key=29e2619a94b2f9dd0ca5609beac3eeda&language=${sort.lang}&append_to_response=credits`)
            const data = {
                ...responseTMDB.data,
                last_updated_at_trakt: shows[show].last_updated_at
            }
            showsDatas[show] = data
            await TraktDB.addToDB(show, data)
            setLoadInfos(<Load info="(7/7) Loading shows datas from tmdb" moreInfo={responseTMDB.data.name} />)
        } catch (error) { console.log(`Erreur dans le chargement de ${shows[show].show.title}`) }
    }

    return { ratingsShows, shows, showsDatas }
}

async function getData(setLoadInfos, username, type, sort, setMovies, setShows) {
    const date_start = sort.seen ? new Date(sort.seen).toISOString() : "2000-06-01T00%3A00%3A00.000Z"
    const date_end = sort.seen ? new Date(`${parseInt(sort.seen) + 1}`).toISOString() : new Date().toISOString()
    const headers = {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': 'c5036d6ef235c8d7d1c0ffbc122681ee5506b633f226395458cd568bb88fce92'
    }

    ClearData()

    setLoadInfos(<Load info="(1/7) Loading cached data" />)
    cachedData = await TraktDB.getAllFromDB()

    const { ratingsMovies, movies, moviesDatas } = sort.hideMovies ? {} : await getMovieData(username, type, sort, headers, setLoadInfos, cachedData, date_start, date_end)
    const { ratingsShows, shows, showsDatas } = sort.hideShows ? {} : await getShowData(username, type, sort, headers, setLoadInfos, cachedData, date_start, date_end)

    setLoadInfos(<></>)

    await setMovies(sort.hideMovies ? <></> : Object.entries(movies).map(([id, data]) =>
        <Content key={id} id={id} data={data} res={moviesDatas[id]} type="movie" sort={sort} rating={ratingsMovies[id]} />
    ))

    await setShows(sort.hideShows ? <></> : Object.entries(shows).map(([id, data]) =>
        <Content key={id} id={id} data={data} res={showsDatas[id]} type="show" sort={sort} rating={ratingsShows[id]} />
    ))
}

export default function Grid() {
    const [movies, setMovies] = useState()
    const [shows, setShows] = useState()
    const [loadInfos, setLoadInfos] = useState()
    const urlParams = new URLSearchParams(window.location.search)
    const username = urlParams.get('username')
    const hideMovies = urlParams.get('hideMovies') == "true"
    const hideShows = urlParams.get('hideShows') == "true"
    const sort = {
        year: urlParams.get('year'),
        lang: urlParams.get('lang'),
        region: urlParams.get('region'),
        seen: urlParams.get('seen'),
        last_air_date: urlParams.get('last_air_date'),
        available: urlParams.get('available') == "true",
        watchlist: urlParams.get('watchlist') == "true",
        up_to_date: urlParams.get('up_to_date') == "true",
        hideMovies,
        hideShows
    }
    const type = sort.watchlist == true ? 'watchlist' : 'watched'

    useEffect(() => {
        if (username == null || username === "") return
        getData(setLoadInfos, username, type, sort, setMovies, setShows)
    }, []);

    return (
        <div className="main">
            {loadInfos}
            <div className="gallerie">
                {!hideMovies && movies}
                {!hideShows && shows}
            </div>
        </div>
    )
}