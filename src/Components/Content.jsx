import "../scss/movie.scss"
import {  useRef } from "react"
import { WrappedData } from "./Wrapped"
import notFound from '../assets/notFound.jpg'

function getShowData(comp, res, type, data, sort) {
    if (type != "show") return comp
    if (res.seasons == undefined) return comp

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
    if (sort.seen && data?.last_watched_at?.split("-")[0] != sort.seen) {
        return null
    }

    comp.title = type == "movie" ? res.title : res.name
    comp.date = type == "movie" ? res.release_date : res.first_air_date
    comp.year = (type == "movie" ? res.release_date : res.first_air_date)?.split("-")[0];
    if (res.releases) {
        const releaseCountry = res?.releases.countries.find(country => country.iso_3166_1 === sort.region);
        if (releaseCountry) comp.year = releaseCountry.release_date.split("-")[0];
    }
    if (sort.year && sort.year != comp.year)
        return null

    comp.available = new Date(comp.date) < new Date()
    if (sort.available && sort.available != comp.available)
        return null
    
    if (comp.year == "") comp.year = "N.C."
    comp.poster = res.poster_path
    comp.up_to_date = true
    comp.last_air_date = comp.year
    comp.genres = res.genres?.map(genre => genre.name)

    return comp
}

function exportData(comp, type, data, res, rating, sort, id) {
    comp.genres?.forEach(genre => {
        if (type == "movie") WrappedData.genres_movies[genre] = (WrappedData.genres_movies[genre] || 0) + 1
        else WrappedData.genres_shows[genre] = (WrappedData.genres_shows[genre] || 0) + 1
        WrappedData.genres[genre] = (WrappedData.genres[genre] || 0) + 1
    })

    try {
        if (type == "movie") {
            WrappedData.movies_by_score[rating].push(id)
            if (sort.seen == comp.year) WrappedData.movies_by_score_this_year[rating].push(id)
        } else {
            WrappedData.shows_by_score[rating].push(id)
            const release_dates = res?.seasons?.flatMap(season => season.air_date) || []
            release_dates?.forEach(date => {
                const year = date?.split("-")[0]
                if (sort.seen == year && WrappedData.shows_by_score_this_year[rating].indexOf(id) == -1)
                    WrappedData.shows_by_score_this_year[rating].push(id)
            })
        }
    } catch (e) {
        console.log("Error in exportData", e)
    }

    res.credits?.cast?.forEach(actor => {
        const database = actor.gender == 1 ? WrappedData.actresses : WrappedData.actors
        if (database[actor.id] == undefined) database[actor.id] = { count: 1, data: actor }
        else database[actor.id].count += 1
    })

    if (res.credits == undefined) {
        window.location.reload()
        return
    }

    res.credits?.crew?.forEach(crew => {
        if (crew.job != "Director") return
        if (WrappedData.directors[crew.id] == undefined)
            WrappedData.directors[crew.id] = {
                count: 1,
                data: crew,
                score: rating || 0,
                total_rating: rating ? 1 : 0,
                average_rating: rating || 0,
                grade: rating || 0 * (rating ? 1 : 0) / 1,
            }
        else {
            const director = WrappedData.directors[crew.id]
            director.count += 1
            director.score += rating || 0
            director.total_rating += rating ? 1 : 0
            director.average_rating = director.total_rating == 0 ? 0 : director.score / director.total_rating
            const not_rating = director.count - director.total_rating || 1
            director.grade = director.average_rating * (director.total_rating / not_rating)
        }
    })

    res.production_countries.forEach(country => {
        if (type == "movie") {
            if (WrappedData.countries_movies[country.iso_3166_1] == undefined) WrappedData.countries_movies[country.iso_3166_1] = { count: 1, data: country }
            else WrappedData.countries_movies[country.iso_3166_1].count += 1
        } else {
            if (WrappedData.countries_shows[country.iso_3166_1] == undefined) WrappedData.countries_shows[country.iso_3166_1] = { count: 1, data: country }
            else WrappedData.countries_shows[country.iso_3166_1].count += 1
        }
        if (WrappedData.countries[country.iso_3166_1] == undefined) WrappedData.countries[country.iso_3166_1] = { count: 1, data: country }
        else WrappedData.countries[country.iso_3166_1].count += 1
    })

    function borneMovie(wrapped, first_date, last_date) {
        if (wrapped.data === null || new Date(first_date) > new Date(last_date)) {
            wrapped.data = {...res, personal_score: rating}
            wrapped.date = data.last_watched_at
        }
    }

    if (type == "movie") {
        borneMovie(WrappedData.first_movie, WrappedData.first_movie.date, data?.last_watched_at)
        borneMovie(WrappedData.last_movie, data?.last_watched_at, WrappedData.last_movie.date)
        WrappedData.total_movies += 1
        WrappedData.total_time_movies += res.runtime

        const date = new Date(data?.last_watched_at)
        const weekDay = date.toLocaleString('en-US', { weekday: 'long' })
        WrappedData.by_week[weekDay] += 1

        var dateString = date.toISOString().split('T')[0]
        if (WrappedData.view_dates[dateString] === undefined) WrappedData.view_dates[dateString] = 1
        else WrappedData.view_dates[dateString] += 1

        if (WrappedData.airing_dates[comp.year] === undefined) WrappedData.airing_dates[comp.year] = 1
        else WrappedData.airing_dates[comp.year] += 1

    } else {
        if (WrappedData.first_show.data === null) WrappedData.first_show.date = new Date()
        const all_episodes = data?.seasons?.flatMap(season => season.episodes) || []
        const sortSeen = new Date(sort.seen)

        if (WrappedData.airing_dates_shows[comp.year] === undefined) WrappedData.airing_dates_shows[comp.year] = 1
        else WrappedData.airing_dates_shows[comp.year] += 1

        all_episodes.forEach(episode => {
            const dateString = episode.last_watched_at
            const date = new Date(dateString)
            const inMonth = sort.months.includes(date.getMonth() + 1)

            // Episodes Data
            if (date > sortSeen && (sort.months.length === 0 || inMonth)) {
                WrappedData.total_episodes += 1
                WrappedData.total_time_shows += res?.last_episode_to_air?.runtime || 0
            }

            // First Show
            if (date < new Date(WrappedData.first_show.date) && date > sortSeen && (sort.months.length === 0 || inMonth)) {
                WrappedData.first_show.data = {...res, personal_score: rating}
                WrappedData.first_show.date = dateString
            }

            // Last Show
            if (WrappedData.last_show.data === null || new Date(WrappedData.last_show.date) < date && (sort.months.length === 0 || inMonth))
            {
                WrappedData.last_show.data = {...res, personal_score: rating}
                WrappedData.last_show.date = dateString
            }
        })
        // total shows
        WrappedData.total_shows += 1
    }
}


export function LoremContent({ data, rating, type, sort, id }) {
    const card = useRef(null)
    const comp = {}

    try {
        comp.title = data[type].title
        comp.year = data[type].year
        comp.play = data.plays
        comp.watched_at = data.last_watched_at?.split('-')[0]
        comp.last_air_date = data[type].year
        comp.available = new Date(comp.date) < new Date()
        comp.genres = []
    } catch (e) {
        comp.title = data.title
        comp.year = undefined
        comp.play = 0
        comp.watched_at = data.watchedAt?.split('-')[0]
        comp.last_air_date = undefined
        comp.available = new Date(comp.watched_at) < new Date()
        comp.genres = []
    }

    const res = {
        credits: {
            cast: [],
            crew: [],
        },
        production_countries: [],
        runtime: 0,
    }

    if (sort.seen && comp.watched_at != sort.seen) return <></>
    if (sort.year && sort.year != comp.year) return <></>
    if (sort.last_air_date && sort.last_air_date != comp.last_air_date) return <></>
    if (sort.available && sort.available != comp.available) return <></>

    exportData(comp, type, data, res, rating, sort, id)

    const hideSelf = () => {
        card.current.style.animation = "hide 0.5s ease"
        setTimeout(() => {
            card.current.style.display = "none"
        }, 500)
    }

    return (
        <article className="movie" ref={card}>
            {rating != undefined ? <div className="rating">{rating}</div> : <></>}
            <img src={notFound} loading="lazy" alt={comp.title} />
            <div className={`data`}>
                <h1>{comp.title}</h1>
                <div className="tags">
                    <div className="tag" title="Release date">{comp.year}</div>
                    <div className="tag" title="Status">{comp.play} play(s)</div>
                    <div className="tag" title="Status">Not in TMDB</div>
                    <div className="tag icon" title="Hide show/movie" onClick={hideSelf}><i className='bx bx-trash' ></i></div>
                    <div className="tag icon" title="Add/remove favorite" onClick={() => {
                        if (card.current.classList.contains("favorite")) card.current.classList.remove("favorite")
                        else card.current.classList.add("favorite")
                    }}><i className='bx bx-heart'></i></div>
                </div>
            </div>
        </article>
    )
}

export default function Content({ data, type, sort, rating, res, id }) {
    const card = useRef(null)
    let comp = {}

    if (res == undefined) return <></>

    comp = getGeneralData(comp, res, type, data, sort)
    if (comp == null) return <></>

    comp = getShowData(comp, res, type, data, sort)
    if (comp == null) return <></>

    exportData(comp, type, data, res, rating, sort, id)

    const hideSelf = () => {
        card.current.style.animation = "hide 0.5s ease"
        setTimeout(() => {
            card.current.style.display = "none"
        }, 500)
    }

    return (
        <article className="movie" ref={card}>
            {rating != undefined ? <div className="rating">{rating}</div> : <></>}
            {comp.poster == undefined ? <></> : <img src={`https://image.tmdb.org/t/p/w500${comp.poster}`} loading="lazy" alt={comp.title} />}
            <div className={`data ${comp.poster != undefined ? "" : "title"}`}>
                <h1>{comp.title}</h1>
                <div className="tags">
                    <div className="tag" title="Release date">{comp.year}{comp.last_air_date == null || comp.last_air_date == comp.year ? "" : `-${comp.last_air_date}`}</div>
                    {type == "show" ? <div className="tag" title="Status">{comp.up_to_date ? "Up to date" : `Not up to date (${comp.total_seen}/${comp.total_episodes})`}</div> : <></> }
                    <div className="tag icon" title="Hide show/movie" onClick={hideSelf}><i className='bx bx-trash' ></i></div>
                    <div className="tag icon" title="Add/remove favorite" onClick={() => {
                        if (card.current.classList.contains("favorite")) card.current.classList.remove("favorite")
                        else card.current.classList.add("favorite")
                    }}><i className='bx bx-heart'></i></div>
                </div>
            </div>
        </article>
    )
}