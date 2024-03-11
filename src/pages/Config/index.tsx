import {useCallback, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import AwardConfig from "./AwardConfig";
import Import from "./Import";

const nav = ['奖项配置', '导入名单']

function Config(props) {
    const {tableData, visible, setVisible} = props
    const [index, setIndex] = useState(0)

    const components = useCallback(() => (
        [<AwardConfig tableData={tableData} />, <Import tableData={tableData} />]
    ), [tableData])

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="config"
                    initial={{x: '100%', y: '100%'}}
                    animate={{x: 0, y: 0}}
                    exit={{x: '100%', y: '-100%'}}
                >
                    <i className="icon-close" onClick={() => setVisible(false)} />
                    <div className="tab-bar">
                        {
                            nav.map((el, i) =>
                                <div key={el} className={`spark-button ${i === index && 'active'}`} onClick={() => setIndex(i)}>{el}</div>
                            )
                        }
                    </div>
                    <div className="config-content">
                        {components()[index]}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Config