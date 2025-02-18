import React, { useState } from 'react'
import "../scss/contest.scss"
import { toggleMenu } from '../App'

export default function Contest({ allRef }) {
    const [allContents, setAllContents] = useState([])
    const [contest, setContest] = useState([])
    const [groups, setGroups] = useState([])
    const [roundWinners, setRoundWinners] = useState([])
    const [losers, setLosers] = useState({})
    const [match1, setMatch1] = useState({ picture: '', year: '', title: '' })
    const [match2, setMatch2] = useState({ picture: '', year: '', title: '' })
    const [index, setIndex] = useState(0)
    const [round, setRound] = useState(1)
    const [podium, setPodium] = useState(<></>)
    const [contestVisible, setContestVisible] = useState(true)
    const [podiumVisible, setPodiumVisible] = useState(false)
    const [maxRounds, setMaxRounds] = useState(0)

    const getAllContents = () => {
        function isDisplayed(el) { return el.offsetParent !== null }

        const elements = document.querySelectorAll('article')
        const displayedElements = Array.from(elements).filter(isDisplayed)

        if (displayedElements.length == 0) { return [] }

        const allContents = []
        for (let i = 0; i < displayedElements.length; i++) {
            const picture = displayedElements[i].querySelector('img')?.src ?? ''
            const year = displayedElements[i].querySelector('.tags').firstChild.innerHTML
            const title = displayedElements[i].querySelector('h1').innerHTML
            allContents.push({ picture, year, title })
        }
        
        return allContents
    }

    function calculateRounds(participants) {
        if (participants < 2) return 0;
        console.log(Math.ceil(Math.log2(participants)))
        return Math.ceil(Math.log2(participants));
    }

    const launchContest = () => {
        setIndex(0)
        setRound(1)
        setRoundWinners([])
        setLosers([])
        setPodium(<></>)
        setContestVisible(true)
        setPodiumVisible(false)

        const menu = document.querySelector('.top_btns')
        if (menu) menu.style.display = 'none'
        const bottomNavbar = document.querySelector('#bottom-navbar')
        if (bottomNavbar) bottomNavbar.style.display = 'none'
        if (allRef.menu.current.classList.contains('active'))
        toggleMenu()
        const menuZone = document.querySelector('.menu-zone')
        menuZone.classList.remove('.active')
        
        const localAllContents = getAllContents()
        setAllContents(localAllContents)
        
        const maxRounds = calculateRounds(localAllContents.length)
        setMaxRounds(maxRounds)

        allRef.grid.current.style.display = 'none'
        allRef.contest.current.style.display = 'block'

        // randomize the array
        const localContest = [...localAllContents]
        for (let i = localContest.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [localContest[i], localContest[j]] = [localContest[j], localContest[i]];
        }

        setContest(localContest)

        // create groups of 2
        const localGroups = []
        for (let i = 0; i < localContest.length; i += 2) {
            localGroups.push([localContest[i], localContest[i + 1]])
        }

        setGroups(localGroups)
        setupMatch(localGroups, 0)
    }

    const setupMatch = (localGroups, localIndex) => {
        setIndex(localIndex)
        const group = localGroups[localIndex]

        setMatch1(group[0] ?? { picture: '', year: '', title: 'Please vote for the other one' })
        setMatch2(group[1] ?? { picture: '', year: '', title: 'Please vote for the other one' })
    }

    const showPodium = () => {
        const localPodium = []

        for (let i = losers.length - 1; i >= 0; i--) {
            const winner = losers[i].winner
            const loser = losers[i].loser
            const className = winner == undefined ? 'big-winner' : 'loser'
            console.log(i, losers.length - 1)
            localPodium.push(
                <div key={i} className="podium-item">
                    {i < losers.length - 1 ? <div className='count'>{losers.length - i}</div> : <></>}
                    <div className={className}>
                        <img src={loser.picture} alt={loser.title} />
                        <p>{loser.title} ({loser.year})</p>
                    </div>
                    {winner
                    ? <div className='winner'>
                        <img src={winner.picture} alt={winner.title} />
                        <p>{winner.title} ({winner.year})</p>
                    </div>
                    : <></>
                    }
                </div>
            )
        }

        setPodium(localPodium)
        setContestVisible(false)
        setPodiumVisible(true)
    }

    const nextRound = () => {
        if (roundWinners.length == 1) {
            showPodium()
            setContest([])
            setRoundWinners([])
            setRound(0)
            setGroups([])
            setIndex(0)
            setMaxRounds(0)
            return
        }

        // randomize the array
        const localContest = [...roundWinners]
        for (let i = localContest.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [localContest[i], localContest[j]] = [localContest[j], localContest[i]];
        }

        // create groups of 2 from round winners
        const localGroups = []
        for (let i = 0; i < localContest.length; i += 2) {
            localGroups.push([localContest[i], localContest[i + 1]])
        }
        
        setContest(localContest)
        setRoundWinners([])
        setRound(round + 1)
        setGroups(localGroups)
        setupMatch(localGroups, 0)
    }

    const voteFor = (winner, loser) => {
        roundWinners.push(winner)
        // remove the winner from the contest
        const localContest = [...contest]
        const indexWinner = localContest.findIndex(el => el.title == winner.title)
        localContest.splice(indexWinner, 1)
        // remove the loser from the contest
        losers.push({"loser": loser, "winner": winner})
        const indexLoser = localContest.findIndex(el => el.title == loser.title)
        localContest.splice(indexLoser, 1)
        setContest(localContest)

        if (localContest.length == 0) {
            if (roundWinners.length == 1) losers.push({"loser": winner, "winner": undefined})
            nextRound()
            return
        }

        setupMatch(groups, index + 1)
    }

    allRef.launchContest = launchContest

    return (
        <div ref={allRef.contest} className="contest" style={{ display: 'none' }}>
            <button className='close' onClick={() => {
                allRef.grid.current.style.display = 'block'
                allRef.contest.current.style.display = 'none'
                const menu = document.querySelector('.top_btns')
                if (menu) menu.style.display = 'flex'
                const bottomNavbar = document.querySelector('#bottom-navbar')
                if (bottomNavbar) bottomNavbar.style.display = 'flex'
            }}><i className='bx bx-x'></i> </button>
            <div className="contest-grid" style={{ display: contestVisible ? 'flex' : 'none' }}>
                <div className='round'>Match {index + 1}/{groups.length} (Round {round}/{maxRounds})</div>
                <div className="match">
                    <button onClick={() => voteFor(match1, match2)}>
                        <img src={match1.picture} alt={match1.title} />
                        <p>{match1.title}</p>
                    </button>
                    <button onClick={() => {if (match2.title != 'Please vote for the other one') voteFor(match2, match1)}}>
                        <img src={match2.picture} alt={match2.title} />
                        <p>{match2.title}</p>
                    </button>
                </div>
            </div>
            <div className="podium" style={{ display: podiumVisible ? 'flex' : 'none' }}>
                <h1 className='result'>Results</h1>
                {podium}
            </div>
        </div>
    );
}