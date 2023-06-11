import "../scss/movie.scss"
import {  useRef } from "react"

function getShowData(comp, res, type, data, sort) {
    if (type != "show") return comp

    if (sort.watchlist) {
        comp.up_to_date = false
        comp.total_seen = 0
        comp.total_episodes = res?.number_of_episodes || 0
        return comp
    }

    const season = res?.last_episode_to_air?.season_number
    const season_seen = data?.seasons?.at(-1).number
    comp.last_air_date = res?.last_episode_to_air?.air_date.substring(0, 4)
    if (sort.last_air_date && sort.last_air_date != comp.last_air_date) return null
    comp.title += season == 1 || sort.last_air_date == null ? "" : ` (S${season_seen})`
    comp.is_last_season = season == season_seen
    comp.total_seen = data?.seasons?.at(-1).episodes.length
    comp.total_episodes = comp.is_last_season ? res?.last_episode_to_air?.episode_number : 0
    for (let i = 0; i < res.seasons.length; i++)
        if (res.seasons[i].season_number == season_seen)
            comp.total_episodes = comp.total_episodes === 0 ? res.seasons[i].episode_count : comp.total_episodes
    comp.up_to_date = comp.is_last_season && comp.total_seen >= comp.total_episodes
    if (sort.up_to_date && sort.up_to_date != comp.up_to_date) return null

    return comp
}

function getGeneralData(comp, res, type, data, sort) {
    if (sort.seen && data.last_watched_at.split("-")[0] != sort.seen) return null
    comp.title = type == "movie" ? res.title : res.name
    comp.date = type == "movie" ? res.release_date : res.first_air_date
    comp.year = type == "movie" ? res.release_date.split("-")[0] : res.first_air_date.split("-")[0]
    if (sort.year && sort.year != comp.year) return null
    comp.available = new Date(comp.date) < new Date()
    if (sort.available && sort.available != comp.available) return null
    if (comp.year == "") comp.year = "N.C."
    comp.poster = res.poster_path
    comp.up_to_date = true
    comp.last_air_date = comp.year
    comp.genres = res.genres.map(genre => genre.name)

    return comp
}

function exportData(comp, type) {
    // Récupérer ici les différentes données pour le Wrapped

    // comp.genres.forEach(genre => {
    //     if (type == "movie") Data_Genre_Movies[genre] = Data_Genre_Movies[genre] == undefined ? 1 : Data_Genre_Movies[genre] + 1
    //     else Data_Genre_Shows[genre] = Data_Genre_Shows[genre] == undefined ? 1 : Data_Genre_Shows[genre] + 1
    // })
}

export default function Content({ data, type, sort, rating, res }) {
    const card = useRef(null)
    let comp = {}

    if (res == undefined) return <></>

    comp = getGeneralData(comp, res, type, data, sort)
    if (comp == null) return <></>

    comp = getShowData(comp, res, type, data, sort)
    if (comp == null) return <></>

    return (
        <article className="movie" ref={card}>
            {rating != undefined ? <div className="rating">{rating}</div> : <></>}
            {comp.poster == undefined ? <></> : <img src={`https://image.tmdb.org/t/p/w500${comp.poster}`} alt={comp.title} />}
            <div className={`data ${comp.poster != undefined ? "" : "title"}`}>
                <h1>{comp.title}</h1>
                <div className="tags">
                    <div className="tag" title="Release date">{comp.year}{comp.last_air_date == null || comp.last_air_date == comp.year ? "" : `-${comp.last_air_date}`}</div>
                    {type == "show" ? <div className="tag" title="Status">{comp.up_to_date ? "Up to date" : `Not up to date (${comp.total_seen}/${comp.total_episodes})`}</div> : <></> }
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
}