import { showRandomElement } from "./RandomElement"
import { allRef } from "../App"

export function toggleMenu() {
    allRef.menu.current.classList.toggle('active')
}

export default function Navbar() {
    return (
        <div className="top_btns">
            <button title="Séléctionner un élément au hasard" onClick={showRandomElement}><i className='bx bx-shuffle' ></i></button>
            <button title="Afficher/masquer les favoris" onClick={() => {allRef.main.current.classList.toggle('fav')}}><i className='bx bx-heart'></i></button>
            <button title="Afficher/masquer les titres" onClick={() => {allRef.main.current.classList.toggle('no-title')}}><i className='bx bx-text' ></i></button>
            <button title="Afficher/masquer les notes" onClick={() => {allRef.main.current.classList.toggle('no-score')}}><i className='bx bxs-graduation' ></i></button>
            <button title="Agrandir/réduire les affiches" onClick={() => {allRef.main.current.classList.toggle('big-picture')}}><i className='bx bx-expand-alt' ></i></button>
            <button title="Nouvelle recherche" onClick={toggleMenu}><i className='bx bx-search-alt-2'></i></button>
        </div>
    )
}