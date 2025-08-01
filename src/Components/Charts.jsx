import { useState, useEffect } from 'react'
import { cachedData } from './TraktImport'
import notFound from '../assets/notFound.jpg'
import { allRef } from '../App'
import '../scss/charts.scss'
import 'cal-heatmap/cal-heatmap.css';
import Heatmap from './Charts/Heatmap'
import { Graph, PieGraph, TreeGraph } from './Charts/Graph'
import { WrappedData } from './Wrapped'
import ChartsMovies from './Charts/ChartsMovies'
import ChartsShows from './Charts/ChartsShows'

export default function Charts() {
    const [tab, setTab] = useState(<ChartsMovies />)

    const switchTab = (newTab) => {
        setTab(newTab)
    }

    const closeCharts = () => {
        document.querySelector('.charts-container').classList.toggle('active')
        allRef.grid.current.style.display = 'flex'
        
        const bottomNavbar = document.querySelector('#bottom-navbar')
        if (bottomNavbar) bottomNavbar.style.display = 'flex'
    }
    allRef.closeCharts = closeCharts

    useEffect(() => {
        const close = (e) => { if (e.key === 'Escape') closeCharts() }
        document.addEventListener('keydown', close)
        return () => { document.removeEventListener('keydown', close) }
    }, [])

    return (
        <div className="charts-container active">
            <div className="warning">
                <p>Please use a larger screen to view the charts.</p>
            </div>
            <div className="body">
                <div className='charts-tabs'>
                    <button className='tab movies' onClick={() => setTab(<ChartsMovies />)}>
                        <span>🎥 Movies</span>
                    </button>
                    <button className='tab shows' onClick={() => setTab(<ChartsShows />)}>
                        <span>📺 Shows</span>
                    </button>
                </div>
                <div className='charts-body-container'>
                    <div className='charts-body'>
                        {tab}
                    </div>
                </div>
            </div>
            <button className='close' onClick={closeCharts}><i className='bx bx-x' ></i></button>
        </div>
    )
}
