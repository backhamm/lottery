import './index.scss'
import {useState} from "react";

function Input(props) {
    const {title, type, value, onChange, onBlur} = props
    const [focus, setFocus] = useState(false)

    return (
        <div className={`input ${focus && 'focus'}`}>
            <input
                value={value}
                onChange={onChange}
                type={type}
                onFocus={() => setFocus(true)}
                onBlur={() => {
                    setFocus(false)
                    onBlur && onBlur()
                }}
                placeholder={title}
            />
        </div>
    )
}

export default Input
