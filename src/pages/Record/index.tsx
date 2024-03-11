import {useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import * as XLSX from 'xlsx';
import './index.scss'

function Record(props) {
    const {tableData, visible, setVisible, current} = props
    const [name, setName] = useState(current)

    const exportToExcel = () => {
        const data = []
        Object.keys(tableData.winnerList).forEach(key => {
            tableData.winnerList[key].forEach(item => {
                const arr = item.split('-')
                data.push({awards: key, dep: arr.length === 2 ? arr[0] : '', name: arr.length === 2 ? arr[1] : arr[0]})
            })
        })
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, '中奖名单.xlsx');
    }

    useEffect(() => {
        setName(current)
    }, [current])

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="record"
                    initial={{x: '-100%', y: '100%'}}
                    animate={{x: 0, y: 0}}
                    exit={{x: '100%', y: '-100%'}}
                >
                    <i className="icon-close" onClick={() => setVisible(false)} />
                    <div className="tab-bar">
                        {tableData.prizeList?.map(el =>
                            <div key={el} className={`spark-button ${el[0] === name && 'active'}`} onClick={() => setName(el[0])}>{el[0]}</div>
                        )}
                    </div>
                    <div className="record-content">
                        <div className="record-title">{name}</div>
                        <div className="record-main">
                            {tableData.winnerList && tableData.winnerList[name]?.map(el => (
                                <div key={el} className="item">{el}</div>
                            ))}
                        </div>
                    </div>
                    {
                        tableData.winnerList && JSON.stringify(tableData.winnerList) !== '{}' && (
                            <div className="export">
                                <div className="spark-button" onClick={exportToExcel}>导出</div>
                            </div>
                        )
                    }
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Record