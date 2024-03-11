import './inde.scss'
import Config from "./Config";
import Record from "./Record";
import Lottery from "./Lottery";
import {useEffect, useState} from "react";

function Home() {
    const [visible, setVisible] = useState(false)
    const [recordVisible, setRecordVisible] = useState(false)
    const [tableData, setTableData] = useState({})
    const [isMotion, setIsMotion] = useState(false)
    const [current, setCurrent] = useState(null)

    useEffect(() => {
        window.ipcRenderer.send('getStore')
        window.ipcRenderer.on('storeData', (e, data) => {
            setTableData(data || {})
        })
        return () => {
            window.ipcRenderer.removeAllListeners('storeData')
        }
    }, [])

    return (
        <div className={`home ${isMotion && 'eventNone'}`}>
            <Lottery tableData={tableData} setIsMotion={setIsMotion} setCurrent={setCurrent} visible={visible} />
            <i className="icon-setting" onClick={() => setVisible(true)} />
            <i className="icon-record" onClick={() => setRecordVisible(true)} />
            <Config tableData={tableData} visible={visible} setVisible={setVisible} />
            <Record tableData={tableData} visible={recordVisible} setVisible={setRecordVisible} current={current} />
        </div>
    )
}

export default Home