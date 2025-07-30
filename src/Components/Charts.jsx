import { useState, useEffect } from 'react'
import { cachedData } from './TraktImport'
import earth from '../assets/earth.png'
import space from '../assets/space.jpg'
import notFound from '../assets/notFound.jpg'
import { allRef } from '../App'
import '../scss/charts.scss'
import 'cal-heatmap/cal-heatmap.css';
import Heatmap from './Charts/Heatmap'

export default function Charts() {
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
            <div className="body">
                < Heatmap />
            </div>
            <button className='close' onClick={closeCharts}><i className='bx bx-x' ></i></button>
        </div>
    )
}
