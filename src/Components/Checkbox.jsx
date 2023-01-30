import '../scss/checkbox.scss'

export default function Checkbox({ label, r, id, onChange }) {
    return (
        <div className='check'>
            <label>{label}</label>
            <div className="toggle-pill-color">
                <input type="checkbox" id={id} ref={r} onChange={onChange}/>
                <label htmlFor={id}></label>
            </div>
        </div>
    )
}