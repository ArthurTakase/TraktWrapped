import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import '../scss/load.scss'

export default function Load({ info, moreInfo }) {
    return (
        <div className="loadZone">
            <AiOutlineLoading3Quarters className="load"/>
            {info ? <div className="infos">{info}</div> : <></>}
            {moreInfo ? <div>{moreInfo}</div> : <></>}
        </div>
    )
}