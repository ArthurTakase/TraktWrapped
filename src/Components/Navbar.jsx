import Checkbox from './Checkbox';
import { toggleMenu } from '../App';
import { allRef } from "../App"
import { TraktDB } from './IndexedDB'
import { useState } from "react"
import Wrapped, { WrappedData } from "./Wrapped"
import { showRandomElement } from "./RandomElement"
import '../scss/navbar.scss'

export default function Navbar() {
    return (
        <>
            <div className="navbar" id='bottom-navbar'>
                <button className="white" style={{display: 'none'}} title="Get random element" onClick={showRandomElement}>
                    <i className='bx bx-shuffle' ></i>
                </button>
                <button className="white" style={{display: 'none'}} title="Hide/Show favorites" onClick={() => {allRef.main.current.classList.toggle('fav')}}>
                    <i className='bx bx-heart'></i>
                </button>
                <button className="white" style={{display: 'none'}} title="Change layout" onClick={() => {
                    allRef.main.current.classList.toggle('no-title')
                    allRef.main.current.classList.toggle('no-score')
                    allRef.main.current.classList.toggle('big-picture')
                }}>
                    <i className='bx bxs-layout'></i>
                </button>
                <button className="red" style={{display: 'none'}} title="Launch your Wrapped" onClick={() => {
                    allRef.launchWrapped()
                }}>
                    <i className='bx bx-party'></i>
                </button>
                <button className="red" style={{display: 'none'}} title="Launch your Wrapped" onClick={() => {
                    allRef.launchContest()
                }}>
                    <i className='bx bx-trophy' ></i>
                </button>
                <button className="white keep big" title="New request" onClick={() => {
                    allRef.menu.current.classList.toggle('active')
                }}>
                    <i className='bx bx-search-alt-2'></i>
                </button>
            </div>
        </>
    )
}