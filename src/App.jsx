import Grid from './Components/Grid'
import Menu from './Components/Menu'
import RandomElement from './Components/RandomElement'
import './scss/app.scss'
import './scss/form.scss'
import './scss/random.scss'
import './scss/wrapped.scss'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom';
import Contest from './Components/Contest'
import Navbar from './Components/Navbar'

export const allRef = {}

export function toggleMenu() {
    allRef.menu.current.classList.toggle('active')
    document.querySelector('#random').classList.remove('active')
}

export default function App() {
    const [searchParams, setSearchParams] = useSearchParams()
    allRef.main = useRef(null)
    allRef.menu = useRef(null)
    allRef.username = useRef(null)
    allRef.year = useRef(null)
    allRef.up_to_date = useRef(null)
    allRef.last_air_date = useRef(null)
    allRef.lang = useRef(null)
    allRef.available = useRef(null)
    allRef.watchlist = useRef(null)
    allRef.seen = useRef(null)
    allRef.hideMovies = useRef(null)
    allRef.hideShows = useRef(null)
    allRef.random = useRef(null)
    allRef.randomTitle = useRef(null)
    allRef.randomYear = useRef(null)
    allRef.randomPoster = useRef(null)
    allRef.region = useRef(null)
    allRef.months = useRef(null)
    allRef.grid = useRef(null)
    allRef.contest = useRef(null)
    allRef.launchContest = null
    allRef.launchWrapped = null
    allRef.closeWrapped = null
    allRef.monthZoneRef = useRef(null)
    allRef.monthOptions = null

    useEffect(() => {        
        allRef.username.current.value = searchParams.get('username')
        allRef.lang.current.value = searchParams.get('lang')
        allRef.year.current.value = searchParams.get('year')
        allRef.seen.current.value = searchParams.get('seen')
        allRef.last_air_date.current.value = searchParams.get('last_air_date')
        allRef.available.current.checked = searchParams.get('available') == 'true'
        allRef.up_to_date.current.checked = searchParams.get('up_to_date') == 'true'
        allRef.watchlist.current.checked = searchParams.get('watchlist') == 'true'
        allRef.hideMovies.current.checked = searchParams.get('hideMovies') == 'true'
        allRef.hideShows.current.checked = searchParams.get('hideShows') == 'true'
        allRef.region.current.value = searchParams.get('region')
        allRef.months.current.value = searchParams.get('months')?.split(',')

        const getMois = (num) => {
            const moisNum = parseInt(num, 10);
            const name = new Date(2000, moisNum - 1).toLocaleString("en-EN", { month: "long" });
            return name.charAt(0).toUpperCase() + name.slice(1);
        };

        allRef.months.current.setValue(allRef.months.current.value?.map(month => ({value: month, label: getMois(month)})))

        if (allRef.seen.current.value != '') allRef.monthZoneRef.current.style.display = 'block'

        if (allRef.username.current.value == '') toggleMenu()
    }, [])

    return (
    <div className="main" ref={allRef.main}>
        <Contest allRef={allRef}/>
        <RandomElement />
        <Menu setSearchParams={setSearchParams}/>
        <Navbar />
        <Grid />
    </div>
    )
}
