import Checkbox from './Checkbox';
import { toggleMenu } from '../App';
import { allRef } from "../App"
import { useState } from "react"
import Wrapped, { WrappedData } from "./Wrapped"
import { useRef } from "react"
import { useEffect } from "react"
import Select from 'react-select'

export default function Menu({ setSearchParams }) {
    const [wrapped, setWrapped] = useState(<></>)

    function submit() {
        const params = {}

        params.username = allRef.username.current.value
        params.lang = allRef.lang.current.value || 'fr-FR'
        params.year = allRef.year.current.value
        params.seen = allRef.seen.current.value
        params.last_air_date = allRef.last_air_date.current.value
        params.available = allRef.available.current.checked
        params.up_to_date = allRef.up_to_date.current.checked
        params.watchlist = allRef.watchlist.current.checked
        params.hideMovies = allRef.hideMovies.current.checked
        params.hideShows = allRef.hideShows.current.checked
        params.region = allRef.region.current.value || 'FR'
        params.months = allRef.months.current.getValue().map(obj => obj.value).join(',')

        // remove empty params or false params
        Object.keys(params).forEach(key => {
            if (params[key] == '' || params[key] == false) delete params[key]
        })

        setSearchParams(params)
        window.location.reload()
    }

    function launchWrapped() {
        if (WrappedData.first_movie.data == null && WrappedData.first_show.data == null) return

        const wrapped = document.querySelector('.wrapped-container')

        if (wrapped && wrapped.classList.contains('active')) {
            allRef.closeWrapped()
            return
        }

        if (wrapped) wrapped.classList.toggle('active')
        else setWrapped(<Wrapped />)

        allRef.grid.current.style.display = 'none'

        if (allRef.menu.current.classList.contains('active'))
            toggleMenu()

        const bottomNavbar = document.querySelector('#bottom-navbar')
        if (bottomNavbar) bottomNavbar.style.display = 'none'
    }

    allRef.launchWrapped = launchWrapped

    function monthOptions() {
    }

    useEffect(() => {
        allRef.seen.current.addEventListener('input', () => {
            if (allRef.seen.current.value != '') allRef.monthZoneRef.current.style.display = 'block'
            else allRef.monthZoneRef.current.style.display = 'none'
        })
    }, [])

    const options = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ]      

    return (
        <>
        <div className="menu-zone" ref={allRef.menu}>
            <div className='menu'>
                <div className='submenu-title'>
                    New Request
                </div>
                <div className='inputgroup'>
                    <label htmlFor="username">Username</label>
                    <input type="text" placeholder="Trakt username" ref={allRef.username} />
                </div>
                <div className='inputgroup'>
                    <label htmlFor="lang">Language</label>
                    <input type="text" placeholder="fr-FR" ref={allRef.lang} />
                </div>
                <div className='inputgroup'>
                    <label htmlFor="region">Region</label>
                    <input type="text" placeholder="FR" ref={allRef.region} />
                </div>
                <div className='inputgroup'>
                    <label htmlFor="year">Released in</label>
                    <input type="text" placeholder="yyyy" ref={allRef.year} />
                </div>
                <div className='inputgroup'>
                    <label htmlFor="seen">Viewed in</label>
                    <input type="text" placeholder="yyyy" ref={allRef.seen} />
                </div>
                <div className='inputgroup' ref={allRef.monthZoneRef} style={{display: 'none', width: '102%'}}>
                    <Select
                        isMulti
                        unstyled
                        options={options}
                        classNamePrefix="react-select"
                        placeholder="Select months (none = all)"
                        closeMenuOnSelect={false}
                        ref={allRef.months} />
                </div>
                <div className='inputgroup'>
                    <label htmlFor="last_air_date">Last air date</label>
                    <input type="text" placeholder="yyyy" ref={allRef.last_air_date} />
                </div>
                <div className='checkZone'>
                    <Checkbox label="Only Available Content" r={allRef.available} id="available" onChange={() => {}} />
                    <Checkbox label="Only Up to date Content" r={allRef.up_to_date} id="up_to_date" onChange={() => {}} />
                    <Checkbox label="From Watchlist" r={allRef.watchlist} id="watchlist" onChange={() => {}} />
                    <Checkbox label="Hide Movies Results" r={allRef.hideMovies} id="hideMovies" onChange={() => {}} />
                    <Checkbox label="Hide Shows Results" r={allRef.hideShows} id="hideShows" onChange={() => {}} />
                </div>
            </div>
            <div className='submit'>
                <button onClick={submit}><i className='bx bx-check'></i>Submit</button>
                <button className="border" onClick={toggleMenu}><i className='bx bx-x'></i>Close Menu</button>
            </div>
        </div>
        {wrapped}
        </>
    )
}