import {useCallback, useEffect, useState} from "react";
import {motion} from "framer-motion";
import {bounceMotion} from "../../utils/motion";
import {toast} from "../../utils/toast";
import title from '../../assets/img/title.png'
import './index.scss'

function Lottery({tableData, setIsMotion, setCurrent, visible}) {
    const {prizeList, importList, winnerList} = tableData
    const [currentItem, setCurrentItem] = useState([])
    const [slotStep, setSlotStep] = useState(0)
    const [winnerData, setWinnerData] = useState(winnerList || {})
    const [initPrize, setInitPrize] = useState(true)
    const [initWinner, setInitWinner] = useState(true)
    const [potWinner, setPotWinner] = useState([])
    const [potStart, setPotStart] = useState(false)

    useEffect(() => {
        if (initPrize && prizeList && prizeList.length) {
            setInitPrize(false)
            setCurrentItem(prizeList[prizeList.length - 1])
        }
    }, [initPrize, prizeList])
    
    useEffect(() => {
        if (!visible) {
            setCurrentItem(prizeList?.find(el => el[0] === currentItem[0]) || [])
            setWinnerData(winnerList || {})
        }
    }, [visible])

    useEffect(() => {
        if (initWinner) {
            setInitWinner(false)
            setWinnerData(winnerList || {})
        }
    }, [initWinner])

    useEffect(() => {
        setSlotStep(0)
        setPotStart(false)
        setPotWinner([])
        setCurrent(currentItem[0])
    }, [currentItem, setCurrent])

    const userList = useCallback(() => {
        const currentWinner = winnerData[currentItem[0]] || []
        if (importList && importList.length) {
            let arr = []
            const repeatArr = ['拉霸好礼']
            importList.forEach(el => {
                if (el[1].includes(currentItem[0])) {
                    arr = [...arr, ...el[0]]
                }
            })
            if (repeatArr.some(el => currentItem.includes(el))) {
                return arr.filter(el => !currentWinner.includes(el))
            } else {
                let allWinner = []
                Object.keys(winnerData).filter(key => !repeatArr.includes(key)).forEach(key => {
                    allWinner = [...allWinner, ...winnerData[key]]
                })
                return arr.filter(el => !allWinner.includes(el))
            }
        } else {
            return []
        }
    }, [currentItem, importList, winnerData])

    const startSlot = () => {
        if (!userList().length) {
            return toast('参与名单不能为空或所有参与人员已中奖')
        }
        if (winnerData[currentItem[0]] && winnerData[currentItem[0]].length >= currentItem[3]) {
            return toast('最大中奖人数：' + currentItem[3])
        }
        const step = slotStep + 1
        if (step === 2) {
            setIsMotion(true)
            const arr = winnerData[currentItem[0]] || []
            const data = JSON.parse(JSON.stringify(winnerData || {}))
            const index = Math.floor(Math.random() * userList().length)
            data[currentItem[0]] = [...arr, userList()[index]]
            setTimeout(() => {
                console.log(111);
                setWinnerData(data)
                setIsMotion(false)
            }, userList().length * 20)
            window.ipcRenderer.send('setStore', {winnerList: data})
        }
        setSlotStep(step > 2 ? 1 : step)
    }

    const getPotWinner = (max = currentItem[4]) => {
        let data = []
        for (let i = 0; i < max; i++) {
            const arr = userList().filter(el => !data.includes(el))
            const val = arr[Math.floor(Math.random() * arr.length)]
            val && data.push(val)
        }
        data = [...new Set(data)]
        if (userList().length < currentItem[4]) {
            return [...new Set([...data, ...userList()])]
        } else {
            return data
        }
    }

    const startPot = () => {
        const currentWinnerList = winnerData[currentItem[0]] || []
        if (!userList().length) {
            return toast('参与名单不能为空或所有人员已中奖')
        }
        if (currentWinnerList && currentWinnerList.length >= currentItem[3]) {
            return toast('最大中奖人数：' + currentItem[3])
        }
        setPotWinner([])
        setPotStart(true)
        setIsMotion(true)
        setTimeout(() => {
            const num = Number(currentItem[4])
            const max = currentWinnerList.length + num > currentItem[3] ? currentItem[3] - currentWinnerList.length : num
            const data = getPotWinner(max) || []
            setPotWinner(data)
            setPotStart(false)
            const winnerObj = JSON.parse(JSON.stringify(winnerData))
            winnerObj[[currentItem[0]]] = [...(winnerData && currentWinnerList || []), ...data]
            setWinnerData(winnerObj)
            window.ipcRenderer.send('setStore', {winnerList: winnerObj})
            setTimeout(() => {
                setIsMotion(false)
            }, max * 400 + 100)
        }, 2000)
    }

    const getMotion = (type, index) => {
        if (type === 'x') {
            const length = potWinner.length < 2 ? 2 : potWinner.length
            const num = 900 / length
            return -(index % 10 - ((length > 10 ? 10 : length) / 2)) * (num + 60) - (num / 2)
        } else {
            return currentItem[4] <= 6 ? 120 : Math.floor(Math.abs(index - 30) / 10) * 100 + 100
        }
    }

    return (
        <div className="lottery">
            <img width={1100} src={title} alt=""/>
            <div className="lottery-content">
                <motion.div
                    className="lottery-left"
                    variants={bounceMotion.container}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="winning-info"
                        variants={bounceMotion.item}
                        transition={{type: 'spring'}}
                    >
                        <div className="lottery-grade">{currentItem[1]}</div>
                        <div className="lottery-name">{currentItem[0]}</div>
                        {currentItem[2] && <div>{isNaN(currentItem[2]) ? currentItem[2] : Number(currentItem[2]).toLocaleString()}</div>}
                    </motion.div>
                    <motion.div
                        className="winning-content"
                        variants={bounceMotion.item}
                        transition={{type: 'spring'}}
                    >
                        <div className="winning-title">{Number(currentItem[4]) === 1 ? '大奖得主': '中奖名单'}</div>
                        <div className="winning-line" />
                        <div className={`winning-list ${currentItem[3] === '1' && 'one'}`}>
                            {winnerData[currentItem[0]] && winnerData[currentItem[0]].map(el => (
                                <div key={el} className="winning-item">
                                    {el}
                                    <div className="cancel-btn" onClick={() => {
                                        setSlotStep(0)
                                        setPotWinner([])
                                        const data = JSON.parse(JSON.stringify(winnerData))
                                        data[currentItem[0]] = winnerData[currentItem[0]].filter(item => item !== el)
                                        setWinnerData(data)
                                        window.ipcRenderer.send('setStore', {winnerList: data})
                                    }} />
                                    <div className="winning-line" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
                <div className="lottery-main">
                    {
                        Number(currentItem[4]) === 1 ? (
                            <motion.div
                                key={String(Number(currentItem[4]) === 1)}
                                className="lottery-slot"
                                initial={{y: '-100%'}}
                                animate={{y: 0}}
                                transition={{type: 'spring'}}
                            >
                                <div className="slot-content">
                                    {
                                        userList() && (
                                            <div
                                                className={`user-list step${slotStep}`}
                                                style={{
                                                    animationDuration: userList().length * ([2, 0.12, 0.02][slotStep]) + 's',
                                                }}
                                            >
                                                {winnerList && winnerList[currentItem[0]] && winnerList[currentItem[0]].length ? (
                                                    <div className="username">
                                                        <div>{winnerList[currentItem[0]][winnerList[currentItem[0]].length - 1].split('-')[0]}</div>
                                                        <div>{winnerList[currentItem[0]][winnerList[currentItem[0]].length - 1].split('-')[1]}</div>
                                                    </div>
                                                ) : <></>}
                                                {userList().map((el: string, i) => (
                                                    <div key={el + i} className="username">
                                                        <div>{el.split('-')[0]}</div>
                                                        <div>{el.split('-')[1]}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    }
                                </div>
                                <div className={`btn-${slotStep === 1 ? 'stop' : 'spin'}`} onClick={startSlot} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key={String(Number(currentItem[4]) === 1)}
                                className="lottery-table"
                                initial={{y: '100%'}}
                                animate={{y: 0}}
                                transition={{type: 'spring'}}
                            >
                                <div className="table-content">
                                    <div
                                        key={JSON.stringify(potWinner)}
                                        className={`bubble-area ${currentItem[4] > 6 && 'more'}`}
                                    >
                                        {potWinner?.map((el, i) => (
                                            <motion.div
                                                key={el}
                                                className={`bubble ${currentItem[4] > 6 && 'mini'}`}
                                                initial={{x: getMotion('x', i), y: getMotion('y', i), opacity: 0}}
                                                animate={{x: 0, y: 0, opacity: 1}}
                                                transition={{type: 'spring', delay: i * 0.4}}
                                            >
                                                <div>{el.split('-')[0]}</div>
                                                <div>{el.split('-')[1]}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className={`lottery-pot ${potStart && 'start'}`} />
                                    <div className="lottery-gold" />
                                    <div className="operate-btn">
                                        <div className="btn-start" onClick={startPot} />
                                    </div>
                                </div>
                            </motion.div>
                        )
                    }
                </div>
                <div className="lottery-btn">
                    {prizeList && prizeList.map(el => (
                        <div key={el[0]} className={`btn-item ${currentItem[0] === el[0] && 'active'}`} onClick={() => {
                            setCurrentItem(el)
                        }}>{el[0]}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Lottery