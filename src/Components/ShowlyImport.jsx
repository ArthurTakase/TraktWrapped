import Content, { LoremContent } from './Content'
import { ClearData, WrappedData } from "./Wrapped"
import axios from 'axios'
import Load from './Load'
import '../scss/app.scss'
import { cachedData, setCachedData } from './TraktImport'
import { TraktDB } from './IndexedDB'

async function getMovieData(showlyData, type, sort, setLoadInfos, cachedData, start, end) {
    let showlyMovies = {}

    if (!showlyData || !showlyData.movies || !showlyData.movies.cH) {
        setLoadInfos(<Load info="(Error) Format of Showly data is not correct" />)
        return
    }

    setLoadInfos(<Load info="(2/10) Loading movies list" />)
    const targetList = type == "watched" ? showlyData.movies.cH : showlyData.movies.cW
    for (const movie of targetList) {
        showlyMovies[movie.id] = {
            id: movie.id,
            tmId: movie.tmId,
            title: movie.t,
            watchedAt: movie.a,
            last_watched_at: movie.a,
            rating: undefined
        }
    }

    setLoadInfos(<Load info="(3/10) Loading movies rating" />)
    if (type == "watched") {
        for (const rating of showlyData.movies.rM) {
            if (showlyMovies[rating.id])
                showlyMovies[rating.id].rating = rating.r
        }
    }

    setLoadInfos(<Load info="(4/10) Keep only movies watched in the period" />)
    const date_start = new Date(start)
    const date_end = new Date(end)

    const isMovieWatchedInPeriod = (date, date_start, date_end, sort) => {
        const watchedAt = new Date(date)
        if (date_start !== undefined && watchedAt < date_start) return false
        if (watchedAt > date_end) return false

        if (sort.months.length > 0) {
            const month = watchedAt.getMonth()
            if (!sort.months.includes((month + 1))) return false
        }

        return true
    }
    
    if (!sort.watchlist) {
        for (const movie in showlyMovies) {
            if (!isMovieWatchedInPeriod(showlyMovies[movie], date_start, date_end, sort))
                delete showlyMovies[movie]
        }
    }
    
    setLoadInfos(<Load info="(5/10) Request movies datas from tmdb" />)
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
            setLoadInfos(<Load info={`(5/10) Request movies datas from tmdb (${(currentIndex / totalIndex * 100).toFixed(2)}%)`} moreInfo={responseTMDB.data.title} />)
        } catch (e) {
            loremMoviesDatas[movie] = showlyMovies[movie]
            cachedData[movie] = showlyMovies[movie]
        }
    }

    if (sort.year) {
        const release_date_start = new Date(sort.year)
        const release_date_end = new Date(sort.year)
        release_date_end.setFullYear(release_date_end.getFullYear() + 1)

        for (const movie in showlyMovies) {
            if (!isMovieWatchedInPeriod(cachedData[movie].release_date, release_date_start, release_date_end, sort))
                delete showlyMovies[movie]
        }
    }

    return { showlyMovies, moviesDatas, loremMoviesDatas }
}

async function getShowData(showlyData, type, sort, setLoadInfos, cachedData, start, end) {
    setLoadInfos(<Load info="(6/10) Loading shows ratings" />)
    let showlyShows = {}

    if (!showlyData || !showlyData.shows || !showlyData.shows.cH) {
        setLoadInfos(<Load info="(Error) Format of Showly data is not correct" />)
        return
    }

    setLoadInfos(<Load info="(7/10) Loading shows list" />)
    const targetList = type == "watched" ? showlyData.shows.cH : showlyData.shows.cW
    for (const show of targetList) {
        showlyShows[show.id] = {
            id: show.id,
            tmId: show.tmId,
            title: show.t,
            watchedAt: show.a,
            last_watched_at: show.a,
            rating: undefined,
            seasons: []
        }
    }

    if (type == "watched") {
        for (const show of showlyData.shows.cHid) {
            showlyShows[show.id] = {
                id: show.id,
                tmId: show.tmId,
                title: show.t,
                watchedAt: show.a,
                last_watched_at: show.a,
                rating: undefined,
                seasons: []
            }
        }

        for (const season of showlyData.shows.pSe) {
            if (!showlyShows[season.sId]) continue
            showlyShows[season.sId].seasons.push({
                episodes: [],
                number: season.sN
            })
        }

        for (const episode of showlyData.shows.pEp) {
            if (!showlyShows[episode.sId]) continue

            var dateString = new Date(episode.a).toISOString().split('T')[0]
            if (WrappedData.view_dates_shows[dateString] === undefined) WrappedData.view_dates_shows[dateString] = 1
            else WrappedData.view_dates_shows[dateString] += 1
            
            var season = showlyShows[episode.sId].seasons.find(s => s.number == episode.sN)
            if (!season) {
                showlyShows[episode.sId].seasons.push({
                    episodes: [],
                    number: episode.sN
                })
                season = showlyShows[episode.sId].seasons.find(s => s.number == episode.sN)
            }
            season.episodes.push({
                id: episode.id,
                number: episode.eN,
                last_watched_at: episode.a,
            })
        }
    }

    setLoadInfos(<Load info="(8/10) Keep only shows watched in the period" />)

    const isShowWatchedInPeriod = (show, date_start, date_end, sort) => {
        for (const season of show.seasons) {
            for (const episode of season.episodes) {
                const last_watched = new Date(episode.last_watched_at)
                if ((date_start === undefined || last_watched >= date_start)
                    && (date_end === undefined || last_watched <= date_end)
                    && (sort.months.length === 0 || sort.months.includes(last_watched.getMonth() + 1))) {
                        return true
                }
            }
        }
        return false
    }

    const isShowReleasedInPeriod = (show, date_start, date_end) => {
        for (const season of show.seasons) {
            const last_watched = new Date(season.air_date)
            if ((date_start !== undefined || last_watched >= date_start) && last_watched <= date_end)
                return true
        }
    }

    const date_start = new Date(start)
    const date_end = new Date(end)

    if (!sort.watchlist) {
        for (const show in showlyShows) {
            if (!isShowWatchedInPeriod(showlyShows[show], date_start, date_end, sort))
                delete showlyShows[show]
        }
    }

    setLoadInfos(<Load info="(9/10) Loading shows rating" />)
    if (type == "watched") {
        for (const rating of showlyData.shows.rS) {
            if (showlyShows[rating.id])
                showlyShows[rating.id].rating = rating.r
        }
    }

    setLoadInfos(<Load info="(10/10) Loading shows data from tmdb" />)
    var currentIndex = 0
    const totalIndex = Object.keys(showlyShows).length
    const showsDatas = {}
    const loremShowsDatas = {}

    for (const show in showlyShows) {
        const tmdbID = showlyShows[show].tmId
        if (cachedData[show] && cachedData[show].last_updated_at_trakt === showlyShows[show].last_updated_at) { 
            showsDatas[show] = cachedData[show]
            cachedData[show] = showsDatas[show]
            continue
        }

        try {
            const responseTMDB = await axios.get(`https://api.themoviedb.org/3/tv/${tmdbID}?api_key=758d153839db0de784edeec4ab6a5fb0&language=${sort.lang}&append_to_response=credits`)
            const data = {
                ...responseTMDB.data,
                last_updated: showlyShows[show].last_updated_at
            }
            showsDatas[show] = data
            cachedData[show] = data
            await TraktDB.addToDB(show, data)
            currentIndex++
            setLoadInfos(<Load info={`(10/10) Loading shows datas from tmdb (${(currentIndex / totalIndex * 100).toFixed(2)}%)`} moreInfo={responseTMDB.data.name} />)
        } catch (e) {
            loremShowsDatas[show] = showlyShows[show]
            cachedData[show] = showlyShows[show]
        }
    }
    
    if (sort.year) {
        const release_date_start = new Date(sort.year)
        const release_date_end = new Date(sort.year)
        release_date_end.setFullYear(release_date_end.getFullYear() + 1)

        for (const show in showlyShows) {
            if (!isShowReleasedInPeriod(cachedData[show], release_date_start, release_date_end))
                delete showlyShows[show]
        }
    }

    return { showlyShows, showsDatas, loremShowsDatas }
}

export async function getDataShowly(setLoadInfos, type, sort, setMovies, setShows, setLoremMovies, setLoremShows, showlyData) {
    const date_start = sort.seen ? new Date(sort.seen).toISOString() : undefined
    const date_end = sort.seen ? new Date(`${parseInt(sort.seen) + 1}`).toISOString() : new Date().toISOString()

    ClearData()
    const tempCachedData = await TraktDB.getAllFromDB()
    setCachedData(tempCachedData)

    const bottomNavbar = document.querySelector('#bottom-navbar')
    const buttons = bottomNavbar?.querySelectorAll('button:not(.keep)')
    const buttonCharts = bottomNavbar?.querySelector('button:not(.keep).charts')
    const lastButton = bottomNavbar?.querySelector('button.keep')
    buttons.forEach(button => button.style.display = 'none')
    lastButton.classList.add('big')

    setLoadInfos(<Load info="(1/10) Reading Showly json" />)

    const loaded_data = { movies: null, shows: null }

    if (!sort.hideMovies) loaded_data.movies = await getMovieData(showlyData, type, sort, setLoadInfos, cachedData, date_start, date_end)
    if (!sort.hideShows) loaded_data.shows = await getShowData(showlyData, type, sort, setLoadInfos, cachedData, date_start, date_end)

    setMovies(sort.hideMovies ? <></> : Object.entries(loaded_data.movies.showlyMovies).map(([id, data]) => {
        return <Content key={id} id={id} data={data} res={loaded_data.movies.moviesDatas[id]} type="movie" sort={sort} rating={data.rating} />
    }))

    setLoremMovies(sort.hideMovies ? <></> : Object.entries(loaded_data.movies.loremMoviesDatas).map(([id, data]) => {
        return <LoremContent key={id} id={id} data={data} type="movie" sort={sort} rating={data.rating} />
    }))

    setLoadInfos(<></>)

    setShows(sort.hideShows ? <></> : Object.entries(loaded_data.shows.showlyShows).map(([id, data]) => {
        return <Content key={id} id={id} data={data} res={loaded_data.shows.showsDatas[id]} type="show" sort={sort} rating={data.rating} />
    }))
    
    setLoremShows(sort.hideShows ? <></> : Object.entries(loaded_data.shows.loremShowsDatas).map(([id, data]) => {
        return <LoremContent key={id} id={id} data={data} type="show" sort={sort} rating={data.rating} />
    }))

    buttons.forEach(button => button.style.display = 'flex')
    buttonCharts.style.display = sort.seen ? 'flex' : 'none'
    lastButton.classList.remove('big')
}