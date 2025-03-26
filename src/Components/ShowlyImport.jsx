import Content, { LoremContent } from './Content'
import { ClearData } from "./Wrapped"
import axios from 'axios'
import Load from './Load'
import '../scss/app.scss'
import { cachedData } from './TraktImport'
import { TraktDB } from './IndexedDB'

async function getMovieData(showlyData, type, sort, setLoadInfos, cachedData, start, end) {
    let showlyMovies = {}

    if (!showlyData || !showlyData.movies || !showlyData.movies.cH) {
        setLoadInfos(<Load info="(Error) Format of Showly data is not correct" />)
        return
    }

    setLoadInfos(<Load info="(2/8) Loading movies list" />)
    const targetList = type == "watched" ? showlyData.movies.cH : showlyData.movies.cW
    for (const movie of targetList) {
        showlyMovies[movie.id] = {
            id: movie.id,
            tmId: movie.tmId,
            title: movie.t,
            watchedAt: movie.a,
            last_watched_at: movie.a,
            rating: -1
        }
    }

    setLoadInfos(<Load info="(3/8) Loading movies rating" />)
    if (type == "watched") {
        for (const rating of showlyData.movies.rM) {
            if (showlyMovies[rating.id])
                showlyMovies[rating.id].rating = rating.r
        }
    }

    setLoadInfos(<Load info="(4/8) Keep only movies watched in the period" />)
    const date_start = new Date(start)
    const date_end = new Date(end)

    const isMovieWatchedInPeriod = (movie, date_start, date_end, sort) => {
        const watchedAt = new Date(movie.watchedAt)
        if (watchedAt < date_start) return false
        if (watchedAt > date_end) return false

        if (sort.months.length > 0) {
            const month = watchedAt.getMonth()
            if (!sort.months.includes((month + 1))) return false
        }

        return true
    }

    for (const movie in showlyMovies) {
        if (!isMovieWatchedInPeriod(showlyMovies[movie], date_start, date_end, sort)) {
            delete showlyMovies[movie]
        }
    }
    
    setLoadInfos(<Load info="(5/8) Request movies datas from tmdb" />)
    var currentIndex = 0
    const totalIndex = Object.keys(showlyMovies).length
    const moviesDatas = {}
    const loremMoviesDatas = {}

    for (const movie in showlyMovies) {
        if (cachedData[movie]) {
            moviesDatas[movie] = cachedData[movie]
            continue
        }

        try {
            const tmdbID = showlyMovies[movie].tmId
            const responseTMDB = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbID}?api_key=758d153839db0de784edeec4ab6a5fb0&language=${sort.lang}&append_to_response=releases,credits`)
            const data = {
                ...responseTMDB.data,
                last_updated: showlyData.createdAt
            }
            moviesDatas[movie] = data
            cachedData[movie] = data
            await TraktDB.addToDB(movie, data)
            currentIndex++
            setLoadInfos(<Load info={`(4/8) Request movies datas from tmdb (${(currentIndex / totalIndex * 100).toFixed(2)}%)`} moreInfo={responseTMDB.data.title} />)
        } catch (e) {
            loremMoviesDatas[movie] = showlyMovies[movie]
            cachedData[movie] = showlyMovies[movie]
        }
    }

    return { showlyMovies, moviesDatas, loremMoviesDatas }
}

async function getShowData(username, type, sort, headers, setLoadInfos, cachedData, start, end) {
    // setLoadInfos(<Load info="(5/7) Loading shows ratings" />)
    // const responseRating = await axios.get(`https://api.trakt.tv/users/${username}/ratings/shows/`, { headers })
    // const ratingsShows = responseRating.data.reduce((acc, show) => {
    //     acc[show.show.ids.trakt] = show.rating
    //     return acc
    // }, {})

    // setLoadInfos(<Load info="(6/7) Loading shows data from trakt" />)
    // const responseInfos = await axios.get(`https://api.trakt.tv/users/${username}/${type}/shows`, { headers })
    // const date_start = new Date(start)
    // const date_end = new Date(end)
    // const isShowWatchedInPeriod = (show, date_start, date_end, sort) => {
    //     for (const season of show.seasons) {
    //         for (const episode of season.episodes) {
    //             const last_watched = new Date(episode.last_watched_at)
    //             if (last_watched >= date_start
    //                 && last_watched <= date_end
    //                 && (sort.months.length === 0 || sort.months.includes(last_watched.getMonth() + 1))) {
    //                 return true
    //             }
    //         }
    //     }
    // }
    // const shows = responseInfos.data.reduce((acc, show) => {
    //     if (isShowWatchedInPeriod(show, date_start, date_end, sort)) {
    //         acc[show.show.ids.trakt] = {
    //             tmdb: show.show.ids.tmdb,
    //             ...show,
    //         }
    //     }
    //     return acc
    // }, {})

    // var currentIndex = 0
    // const totalIndex = Object.keys(shows).length

    // setLoadInfos(<Load info="(7/7) Loading shows datas from tmdb" />)
    // const showsDatas = {}
    // const loremShowsDatas = {}
    // for (const show in shows) {
    //     const tmdbID = shows[show].tmdb
    //     if (cachedData[show] && cachedData[show].last_updated_at_trakt === shows[show].last_updated_at) { 
    //         showsDatas[show] = cachedData[show]
    //         cachedData[show] = showsDatas[show]
    //         continue
    //     }

    //     try {
    //         const responseTMDB = await axios.get(`https://api.themoviedb.org/3/tv/${tmdbID}?api_key=758d153839db0de784edeec4ab6a5fb0&language=${sort.lang}&append_to_response=credits`)
    //         const data = {
    //             ...responseTMDB.data,
    //             last_updated_at_trakt: shows[show].last_updated_at
    //         }
    //         showsDatas[show] = data
    //         cachedData[show] = data
    //         await TraktDB.addToDB(show, data)
    //         currentIndex++
    //         setLoadInfos(<Load info={`(7/7) Loading shows datas from tmdb (${(currentIndex / totalIndex * 100).toFixed(2)}%)`} moreInfo={responseTMDB.data.name} />)
    //     } catch (e) {
    //         loremShowsDatas[show] = shows[show]
    //         cachedData[show] = shows[show]
    //     }
    // }

    // return { ratingsShows, shows, showsDatas, loremShowsDatas }
}

export async function getDataShowly(setLoadInfos, type, sort, setMovies, setShows, setLoremMovies, setLoremShows, showlyData) {
    const date_start = sort.seen ? new Date(sort.seen).toISOString() : "1900-06-01T00%3A00%3A00.000Z"
    const date_end = sort.seen ? new Date(`${parseInt(sort.seen) + 1}`).toISOString() : new Date().toISOString()

    ClearData()

    const bottomNavbar = document.querySelector('#bottom-navbar')
    const buttons = bottomNavbar?.querySelectorAll('button:not(.keep)')
    const lastButton = bottomNavbar?.querySelector('button.keep')
    buttons.forEach(button => button.style.display = 'none')
    lastButton.classList.add('big')

    setLoadInfos(<Load info="(1/8) Reading Showly json" />)

    const {showlyMovies, moviesDatas, loremMoviesDatas} = await getMovieData(showlyData, type, sort, setLoadInfos, cachedData, date_start, date_end)
    // const { ratingsShows, shows, showsDatas, loremShowsDatas } = sort.hideShows ? {} : await getShowData(showlyData, type, sort, setLoadInfos, cachedData, date_start, date_end)

    setLoadInfos(<></>)

    console.log("showlyMovies", showlyMovies)
    console.log("moviesDatas", moviesDatas)
    console.log("loremMoviesDatas", loremMoviesDatas)
    
    setMovies(sort.hideMovies ? <></> : Object.entries(showlyMovies).map(([id, data]) => {
        return <Content key={id} id={id} data={data} res={moviesDatas[id]} type="movie" sort={sort} rating={data.rating} />
    }))

    setLoremMovies(sort.hideMovies ? <></> : Object.entries(loremMoviesDatas).map(([id, data]) => {
        return <LoremContent key={id} id={id} data={data} type="movie" sort={sort} rating={data.rating} />
    }))

    // await setShows(sort.hideShows ? <></> : Object.entries(shows).map(([id, data]) =>
    //     <Content key={id} id={id} data={data} res={showsDatas[id]} type="show" sort={sort} rating={ratingsShows[id]} />
    // ))
    
    // await setLoremShows(sort.hideShows ? <></> : Object.entries(loremShowsDatas).map(([id, data]) =>
    //     <LoremContent key={id} id={id} data={data} type="show" sort={sort} rating={ratingsShows[id]} />
    // ))

    buttons.forEach(button => button.style.display = 'flex')
    lastButton.classList.remove('big')
}