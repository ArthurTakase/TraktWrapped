import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Load from "./Load"
import "../scss/movie.scss"
import Graph, { Data_Genre_Movies, Data_Genre_Shows, All_Movies, All_Shows } from "./Chart"

export default function Movie({ data, type, sort, setGraph, ratings }) {
    const [movie, setMovie] = useState(<Load />)
    const tmdb = type == "movie" ? 'movie' : 'tv'
    const url = `https://api.themoviedb.org/3/${tmdb}/${data[type].ids.tmdb}?api_key=29e2619a94b2f9dd0ca5609beac3eeda&language=${sort.lang}`
    const comp = {}
    const card = useRef(null)

    useEffect(() => {
        axios.get(url)
        .then(res => {
            // General data
            comp["title"] = type == "movie" ? res.data.title : res.data.name
            comp["date"] = type == "movie" ? res.data.release_date : res.data.first_air_date
            comp["year"] = type == "movie" ? res.data.release_date.split("-")[0] : res.data.first_air_date.split("-")[0]
            comp["available"] = new Date(comp.date) < new Date()
            if (comp.year == "") comp.year = "N.C."
            comp["poster"] = res.data.poster_path
            comp["up_to_date"] = true
            comp["last_air_date"] = comp["year"]
            comp["genres"] = res.data.genres.map(genre => genre.name)

            // Data from shows
            if (type == "show") {
                const season = res.data.last_episode_to_air.season_number
                comp["last_air_date"] = res.data.last_episode_to_air.air_date.substring(0, 4)
                comp["title"] += season == 1 || sort.last_air_date == null ? "" : ` (S${season})`
                comp["up_to_date"] = season == data.seasons.length
                comp["up_to_date"] = comp["up_to_date"] && data.seasons[data.seasons.length - 1].episodes.length > (res.data.last_episode_to_air.episode_number / 2)
            }

            // Disable data according to sort
            if (sort.seen && data.last_watched_at.split("-")[0] != sort.seen) { setMovie(<></>); return }
            if (sort.year && sort.year != comp.year) { setMovie(<></>); return }
            if (sort.up_to_date && sort.up_to_date != comp.up_to_date) { setMovie(<></>); return }
            if (sort.last_air_date && sort.last_air_date != comp.last_air_date) { setMovie(<></>); return }
            if (sort.available && sort.available != comp.available) { setMovie(<></>); return }
            
            comp.genres.forEach(genre => {
                if (type == "movie") Data_Genre_Movies[genre] = Data_Genre_Movies[genre] == undefined ? 1 : Data_Genre_Movies[genre] + 1
                else Data_Genre_Shows[genre] = Data_Genre_Shows[genre] == undefined ? 1 : Data_Genre_Shows[genre] + 1
            })
            if (type == "movie") { All_Movies.push(comp) } else { All_Shows.push(comp) }
            setGraph(<Graph type={type} />)

            setMovie(
                <article className="movie" ref={card}>
                    {ratings[data[type].ids.tmdb] != undefined ? <div className="rating">{ratings[data[type].ids.tmdb]}</div> : <></>}
                    {comp.poster == undefined ? <></> : <img src={`https://image.tmdb.org/t/p/w500${comp.poster}`} alt={comp.title} />}
                    <div className={`data ${comp.poster != undefined ? "" : "title"}`}>
                        <h1>{comp.title}</h1>
                        <div className="tags">
                            <div className="tag" title="Release date">{comp.year}{comp.last_air_date == null || comp.last_air_date == comp.year ? "" : `-${comp.last_air_date}`}</div>
                            {type == "show" ? <div className="tag" title="Status">{comp.up_to_date ? "Up to date" : "Not up to date"}</div> : <></> }
                            <div className="tag icon" title="Hide show/movie" onClick={() => {
                                card.current.style.display = "none"
                            }}><i className='bx bx-trash' ></i></div>
                            <div className="tag icon" title="Add/remove favorite" onClick={() => {
                                if (card.current.classList.contains("favorite")) card.current.classList.remove("favorite")
                                else card.current.classList.add("favorite")
                            }}><i className='bx bx-heart'></i></div>
                        </div>
                    </div>
                </article>
            )

        })
        .catch(err => { setMovie(<></>) })
    }, [])

    return (<>{movie}</>)
}