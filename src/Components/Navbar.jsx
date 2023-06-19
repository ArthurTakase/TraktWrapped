import { showRandomElement } from "./RandomElement"
import { allRef } from "../App"
import Wrapped, { WrappedData } from "./Wrapped"
import { useState } from "react"

export function toggleMenu() {
    allRef.menu.current.classList.toggle('active')
}

export default function Navbar() {
    const [wrapped, setWrapped] = useState(<></>)

    return (
        <>
        <div className="top_btns">
            <button title="Get random element" onClick={showRandomElement}><i className='bx bx-shuffle' ></i></button>
            <button title="Hide/Show favorites" onClick={() => {allRef.main.current.classList.toggle('fav')}}><i className='bx bx-heart'></i></button>
            <button title="Launch your Wrapped" onClick={() => {
                if (WrappedData.first_movie.data == null && WrappedData.first_show.data == null) return
                const wrapped = document.querySelector('.wrapped-container')
                if (wrapped) wrapped.classList.toggle('active')
                else setWrapped(<Wrapped />)
            }}><i className='bx bx-party'></i></button>
            <button title="Change layout" onClick={() => {
                allRef.main.current.classList.toggle('no-title')
                allRef.main.current.classList.toggle('no-score')
                allRef.main.current.classList.toggle('big-picture')
            }}><i className='bx bxs-layout'></i></button>
            <button title="New request" onClick={toggleMenu}><i className='bx bx-search-alt-2'></i></button>
        </div>
        {wrapped}
        </>
    )
}