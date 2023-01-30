import Wrapped from './Components/Wrapped'
import './scss/app.scss'
import './scss/form.scss'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom';
import Checkbox from './Components/Checkbox';

export default function App() {
    const [searchParams, setSearchParams] = useSearchParams()
    const menu = useRef(null)
    const username = useRef(null)
    const year = useRef(null)
    const up_to_date = useRef(null)
    const last_air_date = useRef(null)
    const lang = useRef(null)
    const available = useRef(null)
    const watchlist = useRef(null)
    const graph = useRef(null)
    const seen = useRef(null)

    function toggleMenu(from) {
        const urlParams = new URLSearchParams(window.location.search)
        const username = urlParams.get('username')

        if (username == null && from != 'search_btn') {
            menu.current.classList.add('active')
            return
        }
        if (from == 'search_btn') {
            console.log("coucou")
            var has = menu.current.classList.contains('active')
            if (has) { menu.current.classList.remove('active') }
            else { menu.current.classList.add('active') }
            return
        }
    }

    function submit() {
        setSearchParams({
            username: username.current.value,
            lang: lang.current.value,
            year: year.current.value,
            seen: seen.current.value,
            last_air_date: last_air_date.current.value,
            available: available.current.checked,
            up_to_date: up_to_date.current.checked,
            watchlist: watchlist.current.checked,
            graph: graph.current.checked
        })

        window.location.reload()
    }

    useEffect(() => {
        toggleMenu()
        
        username.current.value = searchParams.get('username')
        lang.current.value = searchParams.get('lang')
        year.current.value = searchParams.get('year')
        seen.current.value = searchParams.get('seen')
        last_air_date.current.value = searchParams.get('last_air_date')
        available.current.checked = searchParams.get('available') == 'true'
        up_to_date.current.checked = searchParams.get('up_to_date') == 'true'
        watchlist.current.checked = searchParams.get('watchlist') == 'true'
        graph.current.checked = searchParams.get('graph') == 'true'
    }, [])

    return (
    <div className="main">
        <button id="search_btn" onClick={() => {toggleMenu("search_btn")}}><i className='bx bx-search-alt-2'></i></button>
        <div className="graph-zone menu-zone" ref={menu}>
            <div className="group">
                {/* <h1 className="title">Recherche</h1> */}
                <div className="col-1">
                    <div className='menu'>
                        <div className='inputgroup'>
                            <label htmlFor="username">Username</label>
                            <input type="text" placeholder="Trakt username" ref={username} />
                        </div>
                        <div className='inputgroup'>
                            <label htmlFor="lang">Language</label>
                            <input type="text" placeholder="fr-FR" ref={lang} />
                        </div>
                        <div className='inputgroup'>
                            <label htmlFor="year">Year</label>
                            <input type="text" placeholder="yyyy" ref={year} />
                        </div>
                        <div className='inputgroup'>
                            <label htmlFor="seen">Seen</label>
                            <input type="text" placeholder="yyyy" ref={seen} />
                        </div>
                        <div className='inputgroup'>
                            <label htmlFor="last_air_date">Last air date</label>
                            <input type="text" placeholder="yyyy" ref={last_air_date} />
                        </div>
                        <div className='checkZone'>
                            <Checkbox label="Available" r={available} id="available" onChange={() => {}} />
                            <Checkbox label="Up to date" r={up_to_date} id="up_to_date" onChange={() => {}} />
                            <Checkbox label="Watchlist" r={watchlist} id="watchlist" onChange={() => {}} />
                            <Checkbox label="Graph" r={graph} id="graph" onChange={() => {}} />
                        </div>
                    </div>
                    <div className='submit'>
                        <button onClick={submit}>Valider</button>
                    </div>
                </div>
            </div>
        </div>
        <Wrapped />
    </div>
    )
}
