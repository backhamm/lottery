import * as XLSX from 'xlsx'
import React, {useState} from "react";
import './index.scss'
import {toast} from "../../utils/toast";

const Upload = React.forwardRef((props, ref) => {
    const {title, onChange} = props
    const [key, setKey] = useState(0)
    const [fileData, setFileData] = useState({title: '', data: []})

    const clear = e => {
        e?.stopPropagation()
        setFileData({title: '', data: []})
        onChange({title: '', data: []})
        setKey(key + 1)
    }

    React.useImperativeHandle(ref, () => ({
        clear
    }))

    const handleFileUpload = (e) => {
        const files = e.target.files
        const newJsonData = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const reader = new FileReader()

            reader.onload = (event) => {
                const data = event.target.result
                const workbook = XLSX.read(data, { type: 'binary' })
                const sheetName = workbook.SheetNames[0]
                const sheet = workbook.Sheets[sheetName]
                const json = XLSX.utils.sheet_to_json(sheet)
                newJsonData.push({ title: file.name.split('.')[0], data: json })

                if (!json.length) {
                    toast('导入文件不能为空')
                } else if (i === files.length - 1) {
                    onChange(newJsonData[0])
                    setFileData(newJsonData[0])
                    setKey(key + 1)
                }
            }

            reader.readAsBinaryString(file)
        }
    }

    return (
        <div className="upload">
            <input key={key} id="fileInput" type="file" accept=".xls, .xlsx" onChange={handleFileUpload} />
            {
                fileData.title ? (
                    <div className="file-block">
                        {fileData.title}
                        <i className="icon-close" onClick={e => clear(e)} />
                        <div className="file-view">
                            {fileData.data.map((el, i) => (
                                <div key={el.name + i} className="username">{el.dep}-{el.name}</div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <label htmlFor="fileInput" className="file-input">{title}</label>
                )
            }
        </div>
    )
})

export default Upload