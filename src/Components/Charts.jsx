import { useState, useEffect } from 'react'
import { cachedData } from './TraktImport'
import earth from '../assets/earth.png'
import space from '../assets/space.jpg'
import notFound from '../assets/notFound.jpg'
import { allRef } from '../App'
import '../scss/charts.scss'
import 'cal-heatmap/cal-heatmap.css';
import Heatmap from './Charts/Heatmap'
import { Graph, PieGraph } from './Charts/Graph'
import { WrappedData } from './Wrapped'

export default function Charts() {
    const [genresData, setGenresData] = useState([])
    const [yearsData, setYearsData] = useState([])

    const closeCharts = () => {
        document.querySelector('.charts-container').classList.toggle('active')
        allRef.grid.current.style.display = 'flex'
        
        const bottomNavbar = document.querySelector('#bottom-navbar')
        if (bottomNavbar) bottomNavbar.style.display = 'flex'
    }
    allRef.closeCharts = closeCharts

    const processData = () => {
        const genres = Object.entries(WrappedData.genres).map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .filter(genre => genre.value > 2)
            .sort((a, b) => a.value - b.value)
        genres.forEach(genre => {
            if (genre.name.length > 10)
                genre.name = genre.name.slice(0, 10) + '...'
        })
        setGenresData(genres)

        const years = Object.entries(WrappedData.airing_dates).map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10)
            .sort((a, b) => a.name - b.name)
        setYearsData(years)
    }

    useEffect(() => {
        const close = (e) => { if (e.key === 'Escape') closeCharts() }
        document.addEventListener('keydown', close)
        processData()
        return () => { document.removeEventListener('keydown', close) }
    }, [])

    return (
        <div className="charts-container active">
            <div className="body">
                <Heatmap />
                <Graph data={yearsData} />
                <PieGraph data={genresData} />
            </div>
            <button className='close' onClick={closeCharts}><i className='bx bx-x' ></i></button>
        </div>
    )
}
