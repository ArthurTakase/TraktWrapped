import Content from './Content'
import Load from './Load'
import { TraktDB } from './IndexedDB'
import '../scss/app.scss'
import axios from 'axios'
import { useState, useEffect } from 'react'

async function getMovieData(username, type, sort, headers, setLoadInfos, cachedData) {
    setLoadInfos(<Load info="(2/7) Loading movies ratings" />)
    const response = await axios.get(`https://api.trakt.tv/users/${username}/ratings/movies/`, { headers })
    const ratingsMovies = response.data.reduce((acc, movie) => {
        acc[movie.movie.ids.tmdb] = movie.rating
        return acc
    }, {})

    setLoadInfos(<Load info="(3/7) Loading movies data from trakt" />)
    const responseInfos = await axios.get(`https://api.trakt.tv/users/${username}/${type}/movies`, { headers })
    const movies = responseInfos.data.reduce((acc, movie) => {
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

        await axios.get(`https://api.themoviedb.org/3/movie/${movie}?api_key=29e2619a94b2f9dd0ca5609beac3eeda&language=${sort.lang}`)
        .then(async res => {
            moviesDatas[movie] = res.data
            await TraktDB.addToDB(movie, {...res.data, last_updated_at_trakt: movies[movie].last_updated_at})
            setLoadInfos(<Load info="(4/7) Loading movies datas from tmdb" moreInfo={res.data.title} />)
        })
        .catch(res => console.log(`Erreur dans le chargement de ${movies[movie].movie.title}`))
    }

    return { ratingsMovies, movies, moviesDatas }
}

async function getShowData(username, type, sort, headers, setLoadInfos, cachedData) {
    setLoadInfos(<Load info="(5/7) Loading shows ratings" />)
    const responseRating = await axios.get(`https://api.trakt.tv/users/${username}/ratings/shows/`, { headers })
    const ratingsShows = responseRating.data.reduce((acc, show) => {
        acc[show.show.ids.tmdb] = show.rating
        return acc
    }, {})

    setLoadInfos(<Load info="(6/7) Loading shows data from trakt" />)
    const responseInfos = await axios.get(`https://api.trakt.tv/users/${username}/${type}/shows`, { headers })
    const shows = responseInfos.data.reduce((acc, show) => {
        acc[show.show.ids.tmdb] = show
        return acc
    }, {})

    setLoadInfos(<Load info="(7/7) Loading shows datas from tmdb" />)
    const showsDatas = {}
    for (const show in shows) {
        if (cachedData[show] && cachedData[show].last_updated_at_trakt === shows[show].last_updated_at) { 
            showsDatas[show] = cachedData[show]
            continue
        }

        await axios.get(`https://api.themoviedb.org/3/tv/${show}?api_key=29e2619a94b2f9dd0ca5609beac3eeda&language=${sort.lang}`)
        .then(async res => {
            showsDatas[show] = res.data
            await TraktDB.addToDB(show, {...res.data, last_updated_at_trakt: shows[show].last_updated_at})
            setLoadInfos(<Load info="(7/7) Loading shows datas from tmdb" moreInfo={res.data.name} />)
        })
        .catch(res => console.log(`Erreur dans le chargement de ${shows[show].show.title}`))
    }

    return { ratingsShows, shows, showsDatas }
}

async function getData(setLoadInfos, username, type, sort, setMovies, setShows) {
    const headers = {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': 'c5036d6ef235c8d7d1c0ffbc122681ee5506b633f226395458cd568bb88fce92'
    }

    setLoadInfos(<Load info="(1/7) Loading cached data" />)
    const cachedData = await TraktDB.getAllFromDB()

    console.log(cachedData)

    const { ratingsMovies, movies, moviesDatas } = sort.hideMovies ? {} : await getMovieData(username, type, sort, headers, setLoadInfos, cachedData)
    const { ratingsShows, shows, showsDatas } = sort.hideShows ? {} : await getShowData(username, type, sort, headers, setLoadInfos, cachedData)

    setLoadInfos(<></>)

    setMovies(sort.hideMovies ? <></> : Object.entries(movies).map(([id, data]) =>
        <Content key={id} data={data} res={moviesDatas[id]} type="movie" sort={sort} rating={ratingsMovies[id]} />
    ))

    setShows(sort.hideShows ? <></> : Object.entries(shows).map(([id, data]) =>
        <Content key={id} data={data} res={showsDatas[id]} type="show" sort={sort} rating={ratingsShows[id]} />
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
        if (username == null || username === "") { return}
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