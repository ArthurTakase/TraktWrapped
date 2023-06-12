import Content from './Content'
import Load from './Load'
import { TraktDB } from './IndexedDB'
import '../scss/app.scss'
import axios from 'axios'
import { useState, useEffect } from 'react'

async function getMovieData(username, type, sort, headers, setLoadInfos) {
    setLoadInfos(<Load><div className="infos">(1/6) Loading movies ratings</div></Load>)
    const response = await axios.get(`https://api.trakt.tv/users/${username}/ratings/movies/`, { headers })
    const ratingsMovies = response.data.reduce((acc, movie) => {
        acc[movie.movie.ids.tmdb] = movie.rating
        return acc
    }, {})

    setLoadInfos(<Load><div className="infos">(2/6) Loading movies data from trakt</div></Load>)
    const responseInfos = await axios.get(`https://api.trakt.tv/users/${username}/${type}/movies`, { headers })
    const movies = responseInfos.data.reduce((acc, movie) => {
        acc[movie.movie.ids.tmdb] = movie
        return acc
    }, {})

    setLoadInfos(<Load><div className="infos">(3/6) Loading movies datas from tmdb</div></Load>)
    const moviesDatas = {}
    for (const movie in movies) {
        const response = await TraktDB.getFromDB(movie)
        if (response) {
            moviesDatas[movie] = response
            setLoadInfos(<Load>
                <div className="infos">(3/6) Loading movies datas from tmdb</div>
                <div>{moviesDatas[movie].title}</div>
            </Load>)
            continue
        }

        await axios.get(`https://api.themoviedb.org/3/movie/${movie}?api_key=29e2619a94b2f9dd0ca5609beac3eeda&language=${sort.lang}`)
        .then(async res => {
            moviesDatas[movie] = res.data
            await TraktDB.addToDB(movie, res.data)
            setLoadInfos(<Load>
                <div className="infos">(3/6) Loading movies datas from tmdb</div>
                <div>{res.data.title}</div>
            </Load>)
        })
        .catch(res => console.log(`Erreur dans le chargement de ${movies[movie].movie.title}`))
    }

    return { ratingsMovies, movies, moviesDatas }
}

async function getShowData(username, type, sort, headers, setLoadInfos) {
    setLoadInfos(<Load><div className="infos">(4/6) Loading shows ratings</div></Load>)
    const responseRating = await axios.get(`https://api.trakt.tv/users/${username}/ratings/shows/`, { headers })
    const ratingsShows = responseRating.data.reduce((acc, show) => {
        acc[show.show.ids.tmdb] = show.rating
        return acc
    }, {})

    setLoadInfos(<Load><div className="infos">(5/6) Loading shows data from trakt</div></Load>)
    const responseInfos = await axios.get(`https://api.trakt.tv/users/${username}/${type}/shows`, { headers })
    const shows = responseInfos.data.reduce((acc, show) => {
        acc[show.show.ids.tmdb] = show
        return acc
    }, {})

    setLoadInfos(<Load><div className="infos">(6/6) Loading shows datas from tmdb</div></Load>)
    const showsDatas = {}
    for (const show in shows) {
        await axios.get(`https://api.themoviedb.org/3/tv/${show}?api_key=29e2619a94b2f9dd0ca5609beac3eeda&language=${sort.lang}`)
        .then(res => {
            showsDatas[show] = res.data
            setLoadInfos(<Load>
                <div className="infos">(6/6) Loading shows datas from tmdb</div>
                <div>{res.data.name}</div>
            </Load>)
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

    const { ratingsMovies, movies, moviesDatas } = sort.hideMovies ? {} : await getMovieData(username, type, sort, headers, setLoadInfos)
    const { ratingsShows, shows, showsDatas } = sort.hideShows ? {} : await getShowData(username, type, sort, headers, setLoadInfos)

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