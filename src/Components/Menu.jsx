import Checkbox from './Checkbox';
import { toggleMenu } from './Navbar';
import { allRef } from "../App"

export default function Menu({ setSearchParams }) {

    function submit() {
        setSearchParams({
            username: allRef.username.current.value,
            lang: allRef.lang.current.value || 'fr-FR',
            year: allRef.year.current.value,
            seen: allRef.seen.current.value,
            last_air_date: allRef.last_air_date.current.value,
            available: allRef.available.current.checked,
            up_to_date: allRef.up_to_date.current.checked,
            watchlist: allRef.watchlist.current.checked,
            graph: allRef.graph.current.checked,
            collapse: allRef.collapse.current.checked,
            hideMovies: allRef.hideMovies.current.checked,
            hideShows: allRef.hideShows.current.checked,
        })

        window.location.reload()
    }

    return (
        <div className="menu-zone" ref={allRef.menu}>
            <div className='menu'>
                <div className='submenu-title'>
                    Wrapped
                </div>
                <div className='inputgroup'>
                    <label htmlFor="username">Username</label>
                    <input type="text" placeholder="Trakt username" ref={allRef.username} />
                </div>
                <div className='inputgroup'>
                    <label htmlFor="year">Year</label>
                    <input type="text" placeholder="yyyy" ref={allRef.year} />
                </div>
            </div>
            <div className='submit'>
                <button onClick={submit}>Valider</button>
            </div>
            <div className='menu'>
                <div className='submenu-title'>
                    Grid
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
                    <label htmlFor="year">Year</label>
                    <input type="text" placeholder="yyyy" ref={allRef.year} />
                </div>
                <div className='inputgroup'>
                    <label htmlFor="seen">Seen</label>
                    <input type="text" placeholder="yyyy" ref={allRef.seen} />
                </div>
                <div className='inputgroup'>
                    <label htmlFor="last_air_date">Last air date</label>
                    <input type="text" placeholder="yyyy" ref={allRef.last_air_date} />
                </div>
                <div className='checkZone'>
                    <Checkbox label="Available" r={allRef.available} id="available" onChange={() => {}} />
                    <Checkbox label="Up to date" r={allRef.up_to_date} id="up_to_date" onChange={() => {}} />
                    <Checkbox label="Watchlist" r={allRef.watchlist} id="watchlist" onChange={() => {}} />
                    <Checkbox label="Graph" r={allRef.graph} id="graph" onChange={() => {}} />
                    <Checkbox label="Collaspe" r={allRef.collapse} id="collapse" onChange={() => {}} />
                    <Checkbox label="Hide Movies" r={allRef.hideMovies} id="hideMovies" onChange={() => {}} />
                    <Checkbox label="Hide Shows" r={allRef.hideShows} id="hideShows" onChange={() => {}} />
                </div>
            </div>
            <div className='submit'>
                <button onClick={submit}>Valider</button>
                <button onClick={toggleMenu}>Annuler</button>
            </div>
        </div>
    )
}