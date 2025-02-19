import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getAllDatas, insertData } from '../utils/supabaseFunctions';

function App() {
  const [records, setRecords] = useState([]);
  const [studyContent, setStudyContent] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [error, setError] = useState("");
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const onChangeContent = (event) => setStudyContent(event.target.value);;
  const onChangeTime = (event) => setStudyTime(event.target.value);
  const onClickAdd = () => {
    // 全項目が入力されていないときにエラーを設定
    if(studyContent === "" || studyTime === 0 || studyTime === ""){
      return setError(<p>入力されていない項目があります</p>);
    }
    setError("");
    // データベースに記録する
    const newData = {title:studyContent, time:studyTime};
    insertData(newData);
    // 表示用に配列に登録値を追加
    const newRecords = [...records, newData] 
    setRecords(newRecords);
    // 合計時間の計算
    const time = newRecords.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.time), 0);

    setTotalTime(time);
    setStudyContent("");
    setStudyTime(0);
  }

  useEffect(() => {
    const datas =  getAllDatas();
    let dbRecords = [...records];
    datas.then((dataArray) => {
      dataArray.map(
        (data) => {
          dbRecords = [...dbRecords, {title: data.title, time: data.time}]
          setRecords(dbRecords);
        }
      )
    })
    setLoading((loading) => loading = false);
  }, []);

  return (
    <>
      {loading ? <p>loading中</p> : 
      <div>
      <h1>学習記録一覧</h1>
      <div>
        <label htmlFor="studyContent">学習内容</label>
        <input id="studyContent" type="text" value={studyContent} onChange={onChangeContent}/>
      </div>
      <div>
      <label htmlFor="studyTime">学習時間</label>
        <input id="studyTime" type="number"  value={studyTime} onChange={onChangeTime}/>時間
      </div>
      <div>入力されている学習内容:{studyContent}</div>
      <div>入力されている時間:{studyTime}</div>
      <ul>
      {records.map((record) =>  <li>{`${record.title} ${record.time}時間`}</li>)}
      </ul>
      <button onClick={onClickAdd}>登録</button>
      {error}<br />
      合計時間:{totalTime} / 1000(h)  
      </div>
      }
    </>
  )
}

export default App
