import Wrapped from './Components/Wrapped'
import './scss/app.scss'
import './scss/form.scss'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom';

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

    function toggleMenu() {
        // menu.current.classList.toggle('active')
        console.log(menu.current)
    }

    function submit() {
        setSearchParams({
            year: year.current.value,
            up_to_date: up_to_date.current.value,
            last_air_date: last_air_date.current.value,
            lang: lang.current.value,
            available: available.current.value,
            watchlist: watchlist.current.value,
            graph: graph.current.value,
            seen: seen.current.value,
            username: username.current.value
        })

        window.location.reload()
    }

    useEffect(() => {
        toggleMenu()

        year.current.value = searchParams.get('year')
        up_to_date.current.value = searchParams.get('up_to_date')
        last_air_date.current.value = searchParams.get('last_air_date')
        lang.current.value = searchParams.get('lang')
        available.current.value = searchParams.get('available')
        watchlist.current.value = searchParams.get('watchlist')
        graph.current.value = searchParams.get('graph')
        seen.current.value = searchParams.get('seen')
        username.current.value = searchParams.get('username')
    }, [])

    return (
    <div className="main">
        <div className="graph-zone menu-zone" ref={menu}>
            <div className="group">
                <h1 className="title">Recherche</h1>
                <div className="col-1">
                    <div className='menu'>
                        <div className='inputgroup'>
                            <label htmlFor="username">Username</label>
                            <input type="text" placeholder="Trakt username" ref={username} />
                        </div>
                        <div className='inputgroup'>
                            <label htmlFor="year">Year</label>
                            <input type="text" placeholder="yyyy" ref={year} />
                        </div>
                        <div className='inputgroup'>
                            <label htmlFor="up_to_date">Up to date</label>
                            <input type="text" placeholder="bool" ref={up_to_date} />
                        </div>
                        <div className='inputgroup'>
                            <label htmlFor="last_air_date">Last air date</label>
                            <input type="text" placeholder="yyyy" ref={last_air_date} />
                        </div>
                        <div className='inputgroup'>
                            <label htmlFor="lang">Language</label>
                            <input type="text" placeholder="fr-FR" ref={lang} />
                        </div>
                        <div className='inputgroup'>
                            <label htmlFor="available">Available</label>
                            <input type="text" placeholder="bool" ref={available} />
                        </div>
                        <div className='inputgroup'>
                            <label htmlFor="watchlist">Watchlist</label>
                            <input type="text" placeholder="bool" ref={watchlist} />
                        </div>
                        <div className='inputgroup'>
                            <label htmlFor="graph">Graph</label>
                            <input type="text" placeholder="bool" ref={graph} />
                        </div>
                        <div className='inputgroup'>
                            <label htmlFor="seen">Seen</label>
                            <input type="text" placeholder="yyyy" ref={seen} />
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
