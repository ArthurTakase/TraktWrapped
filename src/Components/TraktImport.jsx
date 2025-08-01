import { TraktDB } from './IndexedDB'
import Content, { LoremContent } from './Content'
import { ClearData } from "./Wrapped"
import axios from 'axios'
import Load from './Load'
import '../scss/app.scss'

export let cachedData = {}

export function setCachedData(data) {
    Object.assign(cachedData, data)
}

async function checkIfAccountExists(username, headers) {
    try {
        const response = await axios.get(`https://api.trakt.tv/users/${username}/watched/movies`, { headers })
        return response.status === 200
    } catch (e) {
        return false
    }
}

async function getMovieData(username, type, sort, headers, setLoadInfos, cachedData, start, end) {
    setLoadInfos(<Load info="(2/7) Loading movies ratings" />)
    const response = await axios.get(`https://api.trakt.tv/users/${username}/ratings/movies/`, { headers })
    const ratingsMovies = response.data.reduce((acc, movie) => {
        acc[movie.movie.ids.trakt] = movie.rating
        return acc
    }, {})

    setLoadInfos(<Load info="(3/7) Loading movies data from trakt" />)
    const responseInfos = await axios.get(`https://api.trakt.tv/users/${username}/${type}/movies`, { headers })
    const date_start = new Date(start)
    const date_end = new Date(end)
    const movies = responseInfos.data.reduce((acc, movie) => {
        if (new Date(movie.last_watched_at) < date_start) return acc
        if (new Date(movie.last_watched_at) > date_end) return acc

        if (sort.months.length > 0) {
            const month = new Date(movie.last_watched_at).getMonth()
            if (!sort.months.includes((month + 1))) return acc
        }

        acc[movie.movie.ids.trakt] = {
            tmdb: movie.movie.ids.tmdb,
            ...movie,
        }
        return acc
    }, {})

    var currentIndex = 0
    const totalIndex = Object.keys(movies).length

    setLoadInfos(<Load info="(4/7) Loading movies datas from tmdb" />)
    const moviesDatas = {}
    const loremMoviesDatas = {}
    for (const movie in movies) {
        if (cachedData[movie] && cachedData[movie].last_updated_at_trakt === movies[movie].last_updated_at) {
            moviesDatas[movie] = cachedData[movie]
            continue
        }

        try {
            const tmdbID = movies[movie].tmdb
            const responseTMDB = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbID}?api_key=758d153839db0de784edeec4ab6a5fb0&language=${sort.lang}&append_to_response=releases,credits`)
            const data = {
                ...responseTMDB.data,
                last_updated_at_trakt: movies[movie].last_updated_at
            }
            moviesDatas[movie] = data
            cachedData[movie] = data
            await TraktDB.addToDB(movie, data)
            currentIndex++
            setLoadInfos(<Load info={`(4/7) Loading movies datas from tmdb (${(currentIndex / totalIndex * 100).toFixed(2)}%)`} moreInfo={responseTMDB.data.title} />)
        } catch (e) {
            loremMoviesDatas[movie] = movies[movie]
            cachedData[movie] = movies[movie]
        }
    }

    return { ratingsMovies, movies, moviesDatas, loremMoviesDatas  }
}

async function getShowData(username, type, sort, headers, setLoadInfos, cachedData, start, end) {
    setLoadInfos(<Load info="(5/7) Loading shows ratings" />)
    const responseRating = await axios.get(`https://api.trakt.tv/users/${username}/ratings/shows/`, { headers })
    const ratingsShows = responseRating.data.reduce((acc, show) => {
        acc[show.show.ids.trakt] = show.rating
        return acc
    }, {})

    setLoadInfos(<Load info="(6/7) Loading shows data from trakt" />)
    const responseInfos = await axios.get(`https://api.trakt.tv/users/${username}/${type}/shows`, { headers })
    const date_start = new Date(start)
    const date_end = new Date(end)
    const isShowWatchedInPeriod = (show, date_start, date_end, sort) => {
        for (const season of show.seasons) {
            for (const episode of season.episodes) {
                const last_watched = new Date(episode.last_watched_at)
                if (last_watched >= date_start
                    && last_watched <= date_end
                    && (sort.months.length === 0 || sort.months.includes(last_watched.getMonth() + 1))) {
                    return true
                }
            }
        }
    }
    const shows = responseInfos.data.reduce((acc, show) => {
        if (isShowWatchedInPeriod(show, date_start, date_end, sort)) {
            acc[show.show.ids.trakt] = {
                tmdb: show.show.ids.tmdb,
                ...show,
            }
        }
        return acc
    }, {})

    var currentIndex = 0
    const totalIndex = Object.keys(shows).length

    setLoadInfos(<Load info="(7/7) Loading shows datas from tmdb" />)
    const showsDatas = {}
    const loremShowsDatas = {}
    for (const show in shows) {
        const tmdbID = shows[show].tmdb
        if (cachedData[show] && cachedData[show].last_updated_at_trakt === shows[show].last_updated_at) { 
            showsDatas[show] = cachedData[show]
            cachedData[show] = showsDatas[show]
            continue
        }

        try {
            const responseTMDB = await axios.get(`https://api.themoviedb.org/3/tv/${tmdbID}?api_key=758d153839db0de784edeec4ab6a5fb0&language=${sort.lang}&append_to_response=credits`)
            const data = {
                ...responseTMDB.data,
                last_updated_at_trakt: shows[show].last_updated_at
            }
            showsDatas[show] = data
            cachedData[show] = data
            await TraktDB.addToDB(show, data)
            currentIndex++
            setLoadInfos(<Load info={`(7/7) Loading shows datas from tmdb (${(currentIndex / totalIndex * 100).toFixed(2)}%)`} moreInfo={responseTMDB.data.name} />)
        } catch (e) {
            loremShowsDatas[show] = shows[show]
            cachedData[show] = shows[show]
        }
    }

    return { ratingsShows, shows, showsDatas, loremShowsDatas }
}

export async function getTraktData(setLoadInfos, username, type, sort, setMovies, setShows, setLoremMovies, setLoremShows) {
    const date_start = sort.seen ? new Date(sort.seen).toISOString() : "1900-06-01T00%3A00%3A00.000Z"
    const date_end = sort.seen ? new Date(`${parseInt(sort.seen) + 1}`).toISOString() : new Date().toISOString()
    const headers = {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': 'c5036d6ef235c8d7d1c0ffbc122681ee5506b633f226395458cd568bb88fce92'
    }

    ClearData()

    const exists = await checkIfAccountExists(username, headers)
    if (!exists) {
        setLoadInfos(<Load info="Account not found" />)
        return
    }

    const bottomNavbar = document.querySelector('#bottom-navbar')
    const buttons = bottomNavbar?.querySelectorAll('button:not(.keep)')
    const buttonCharts = bottomNavbar?.querySelector('button:not(.keep).charts')
    const lastButton = bottomNavbar?.querySelector('button.keep')
    buttons.forEach(button => button.style.display = 'none')
    lastButton.classList.add('big')

    setLoadInfos(<Load info="(1/7) Loading cached data" />)
    cachedData = await TraktDB.getAllFromDB()

    const { ratingsMovies, movies, moviesDatas, loremMoviesDatas } = sort.hideMovies ? {} : await getMovieData(username, type, sort, headers, setLoadInfos, cachedData, date_start, date_end)
    const { ratingsShows, shows, showsDatas, loremShowsDatas } = sort.hideShows ? {} : await getShowData(username, type, sort, headers, setLoadInfos, cachedData, date_start, date_end)

    setLoadInfos(<></>)

    setMovies(sort.hideMovies ? <></> : Object.entries(movies).map(([id, data]) =>
        <Content key={id} id={id} data={data} res={moviesDatas[id]} type="movie" sort={sort} rating={ratingsMovies[id]} />
    ))

    setLoremMovies(sort.hideMovies ? <></> : Object.entries(loremMoviesDatas).map(([id, data]) =>
        <LoremContent key={id} id={id} data={data} type="movie" sort={sort} rating={ratingsMovies[id]} />
    ))

    setShows(sort.hideShows ? <></> : Object.entries(shows).map(([id, data]) =>
        <Content key={id} id={id} data={data} res={showsDatas[id]} type="show" sort={sort} rating={ratingsShows[id]} />
    ))
    
    setLoremShows(sort.hideShows ? <></> : Object.entries(loremShowsDatas).map(([id, data]) =>
        <LoremContent key={id} id={id} data={data} type="show" sort={sort} rating={ratingsShows[id]} />
    ))

    buttons.forEach(button => button.style.display = 'flex')
    buttonCharts.style.display = sort.seen ? 'flex' : 'none'
    lastButton.classList.remove('big')
}