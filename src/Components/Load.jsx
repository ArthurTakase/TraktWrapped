import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import '../scss/load.scss'

export default function Load({ children }) {
    return (
        <div className="loadZone">
            <AiOutlineLoading3Quarters className="load"/>
            {children}
        </div>
    )
}