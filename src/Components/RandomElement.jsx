import { allRef } from "../App"

export default function RandomElement() {
    return (
        <div id="random" ref={allRef.random}>
            <button id="random-close" onClick={() => {
                document.querySelector('#random').classList.toggle('active')
            }}><i className='bx bx-x' ></i></button>
            <img id="random-poster" src="" alt="" ref={allRef.randomPoster} />
            <div id="random-title" ref={allRef.randomTitle}></div>
            <div id="random-year" ref={allRef.randomYear} className="tag"></div>
        </div>
    )
}
    
export function showRandomElement() {
    function isDisplayed(el) { return el.offsetParent !== null }

    const elements = document.querySelectorAll('article')
    const displayedElements = Array.from(elements).filter(isDisplayed)

    if (displayedElements.length == 0) { return }

    const random = Math.floor(Math.random() * displayedElements.length)
    const randomElement = displayedElements[random]
    const picture = randomElement.querySelector('img')?.src ?? ''
    const year = randomElement.querySelector('.tags').firstChild.innerHTML
    const title = randomElement.querySelector('h1').innerHTML

    allRef.randomPoster.current.src = picture
    allRef.randomYear.current.innerHTML = year
    allRef.randomTitle.current.innerHTML = title

    allRef.random.current.classList.add('active')
}
