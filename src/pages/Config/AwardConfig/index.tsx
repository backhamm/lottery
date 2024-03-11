import {useEffect, useState} from "react";
import {toast} from "../../../utils/toast";
import Input from "../../../components/Input";
import './index.scss'

const title = ['奖项名称', '奖项等级', '奖品', '中奖人数', '每轮中奖人数']
function AwardConfig({tableData}) {
    const [prize, setPrize] = useState(title.map(() => ''))
    const [editPrize, setEditPrize] = useState(title.map(() => ''))
    const [prizeList, setPrizeList] = useState(tableData?.prizeList || [])
    const [editIndex, setEditIndex] = useState(-1)

    const initInput = () => {
        setPrize(title.map(() => ''))
        setEditIndex(-1)
    }

    useEffect(() => {
        window.ipcRenderer.send('setStore', {prizeList})
    }, [prizeList, tableData?.prizeList])

    const handelChange = (e, i) => {
        const arr = prize.slice()
        arr[i] = e.target.value
        setPrize(arr)
    }

    const add = () => {
        const errIndex = prize.findIndex(el => !el)
        if (errIndex > -1) {
            toast(`请输入${title[errIndex]}`)
        } else {
            const data = JSON.parse(JSON.stringify(prizeList))
            const currentData = JSON.parse(JSON.stringify(prize))
            if (Number(currentData[4]) > Number(currentData[3])) {
                currentData[4] = currentData[3]
            }
            const index = data.findIndex(el => el[0] === prize[0])
            if (index > -1) {
                data[index] = currentData
            } else {
                data.push(currentData)
            }
            setPrizeList(data)
            initInput()
        }
    }

    return (
        <div className="award-config">
            <div className="form-input">
                {title.map((el, i) => (
                    <div key={el} className="input-item">
                        <Input title={'请输入' + el} value={prize[i]} type={i < 3 ? 'text' : 'number'} onChange={e => handelChange(e, i)} />
                    </div>
                ))}
                <div className="btn-group">
                    <div className="spark-button active" onClick={add}>添加</div>
                    <div className="spark-button" onClick={initInput}>清空</div>
                </div>
            </div>
            <div className="form-list">
                <div className="th">
                    {title.map(el => (
                        <div key={el} className="td">{el}</div>
                    ))}
                    <div className="td">编辑</div>
                </div>
                <div className="t-body">
                    {prizeList.map((el, i) => (
                        <div key={i} className="tr">
                            {
                                title.map((title, num) => (
                                    <div key={num} className="td">
                                        {
                                            editIndex === i ?
                                                <Input
                                                    title={title}
                                                    value={editPrize[num]}
                                                    type={num < 3 ? 'text' : 'number'}
                                                    onChange={e => {
                                                        const arr = editPrize.slice()
                                                        arr[num] = e.target.value
                                                        setEditPrize(arr)
                                                    }}
                                                />
                                                :
                                                (num > 1 && !isNaN(Number(el[num]))) ? Number(el[num]).toLocaleString() : el[num]
                                        }

                                    </div>
                                ))
                            }
                            <div className="edit td">
                                {
                                    editIndex === i ?
                                        <i className="icon-confirm size-24" onClick={() => {
                                            const data = JSON.parse(JSON.stringify(prizeList))
                                            const currentData = JSON.parse(JSON.stringify(editPrize))
                                            if (data.every((el, index) => (el[0] !== currentData[0] || index === i))) {
                                                if (Number(currentData[4]) > Number(currentData[3])) {
                                                    currentData[4] = currentData[3]
                                                }
                                                data[i] = currentData
                                                setPrizeList(data)
                                            }
                                            setEditIndex(-1)
                                        }}/>
                                        :
                                        <i className="icon-edit size-24" onClick={() => {
                                            setEditPrize(el)
                                            setEditIndex(i)
                                        }}/>
                                }
                                <i className="icon-close size-24" onClick={() => setPrizeList(prizeList.filter((item, index) => index !== i))} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AwardConfig