
import Load from './Load'
import '../scss/app.scss'
import { useState, useEffect } from 'react'
import { allRef } from '../App'
import { WrappedData } from "./Wrapped"
import { getTraktData } from './TraktImport'
import { getDataShowly } from './ShowlyImport'

export default function Grid() {
    const [movies, setMovies] = useState()
    const [shows, setShows] = useState()
    const [loremMovies, setLoremMovies] = useState()
    const [loremShows, setLoremShows] = useState()
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
        hideShows,
        months: urlParams.get('months')?.split(',') || [],
        fromShowly: urlParams.get('fromShowly') == "true"
    }
    const type = sort.watchlist == true ? 'watchlist' : 'watched'
    sort.months = sort.months.map(month => parseInt(month, 10))
    WrappedData.sort = sort

    allRef.updateGrid = (showlyData = null) => {
        setMovies(<></>)
        setShows(<></>)
        setLoremMovies(<></>)
        setLoremShows(<></>)
        setLoadInfos(<></>)

        if (sort.fromShowly) {
            if (showlyData == null) {
                setLoadInfos(<Load info="No data from Showly, please make a new request." />)
                return
            }
            getDataShowly(setLoadInfos, type, sort, setMovies, setShows, setLoremMovies, setLoremShows, showlyData)
        } else if (username !== null && username !== "")
            getTraktData(setLoadInfos, username, type, sort, setMovies, setShows, setLoremMovies, setLoremShows)
    }

    useEffect(() => {
        allRef.updateGrid()
    }, []);

    return (
        <div className="main" ref={allRef.grid}>
            {loadInfos}
            <div className="gallerie">
                {!hideMovies && movies}
                {!hideMovies && loremMovies}
                {!hideShows && shows}
                {!hideShows && loremShows}
            </div>
        </div>
    )
}
