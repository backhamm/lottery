import {useEffect, useRef, useState} from "react";
import {Select, Input} from "antd";
import Upload from "../../../components/Upload";
import './index.scss'

function Import({tableData}) {
    const uploadRef = useRef(null)
    const [uploadList, setUploadList] = useState({})
    const [awards, setAwards] = useState([])
    const [importList, setImportList] = useState(tableData?.importList || [])
    const [editIndex, setEditIndex] = useState(-1)

    const awardsArr = tableData.prizeList?.map(el => ({label: el[0], value: el[0]}))

    useEffect(() => {
        window.ipcRenderer.send('setStore', {importList})
    }, [importList, tableData?.importList])

    const add = () => {
        setImportList([...importList, [[...new Set(uploadList.data?.map(el => `${el.dep}-${el.name}`) || [])], awards]])
        uploadRef.current?.clear()
        setAwards([])
    }

    const edit = (val, i, valIndex) => {
        const data = JSON.parse(JSON.stringify(importList))
        data[i][valIndex] = !valIndex ? val.split(',') : val
        data[i][0] = [...new Set(data[i][0])]
        setImportList(data)
    }

    return (
        <div className="import">
            <Upload ref={uploadRef} title="导入名单" onChange={data => setUploadList(data)} />
            <Select
                className="awards-select"
                mode="multiple"
                allowClear
                placeholder="请选择关联奖项"
                value={awards}
                onChange={value => setAwards(value)}
                options={awardsArr}
            />
            <div className="spark-button active" onClick={add}>添加</div>
            <div className="table-list">
                <div className="th">
                    <div className="td">参与名单</div>
                    <div className="td">关联奖项</div>
                    <div className="td">操作</div>
                </div>
                <div className="t-body">
                    {importList.map((el, i) => (
                        <div key={i} className="tr">
                            <div className="td">
                                {editIndex === i ?
                                    <Input.TextArea value={el[0].join(',')} autoSize onChange={e => edit(e.target.value, i, 0)} spellCheck={false} />
                                    :
                                    el[0].map((item, i) => <div key={item + i} className="tag">{item}</div>)
                                }
                            </div>
                            <div className="td">
                                {editIndex === i ?
                                    <Select
                                        className="awards-select"
                                        mode="multiple"
                                        allowClear
                                        placeholder="请选择关联奖项"
                                        value={el[1]}
                                        onChange={val => edit(val, i, 1)}
                                        options={awardsArr}
                                    />
                                    :
                                    el[1].map(item => <div key={item} className="tag primary">{item}</div>)
                                }
                            </div>
                            <div className="flex td">
                                {
                                    editIndex === i ?
                                        <i className="icon-confirm size-24" onClick={() => setEditIndex(-1)}/>
                                        :
                                        <i className="icon-edit size-24" onClick={() => setEditIndex(i)}/>
                                }
                                <i className="icon-close size-24" onClick={() => setImportList(importList.filter((item, index) => index !== i))} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Import
