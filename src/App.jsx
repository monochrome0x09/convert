import { useEffect, useState } from "react";
import Select from "./components/select";
import Convert from "./components/convert";

import "./styles/container.css"
import './styles/App.css'

function App() {
    const API_KEY = import.meta.env.VITE_API_KEY ?? "";

    // const [dataLen, setDataLen] = useState([]);
    const [euro, setEuro] = useState(0);
    const [dollor, setDollor] = useState(0);

    const [form, setForm] = useState("");
    const [to, setTo] = useState("");

    const [fSelected, fSetSelected] = useState("cm");
    const [sSelected, sSetSelected] = useState("cm");

    const [mode, setMode] = useState("distance");

    const [goBack, setGoBack] = useState(0);

    function getToday(){
        let date = new Date();
        let year = date.getFullYear();
        let month = ("0" + (1 + date.getMonth())).slice(-2);
        let day = ("0" + (date.getDate() - goBack)).slice(-2);
    
        return year + month + day;
    }

    useEffect(() => {
        fetch('/api/site/program/financial/exchangeJSON?authkey=' + API_KEY + '&searchdate=' + getToday() + '&data=AP01')
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) {
                        // 환율 정보가 없을 경우 (주말)
                        console.log("환율 정보가 없습니다.");
                        setGoBack(prev => prev + 1); // 전날 데이터 불러오기 위한 변수
                        return;
                    }

                    // 환율 정보가 있을 경우 (평일)
                    const euro = data[8].ttb.replace(",", "");
                    const dollor = data[22].ttb.replace(",", "");
                    setEuro(euro)
                    setDollor(dollor);
                })
                .catch(error => console.error('Error:', error));
    }, [goBack])

    const handleMenu = (e) => {
        const className = e.target.className;

        setMode(className);

        switch (className) {
            case "distance": fSetSelected("cm"); sSetSelected("cm"); break;
            case "mass": fSetSelected("g"); sSetSelected("g"); break;
            case "temp": fSetSelected("c"); sSetSelected("c"); break;
            case "time": fSetSelected("s"); sSetSelected("s"); break;
            case "money": 
                fSetSelected("won");   
                sSetSelected("won"); 
                break;
            case "speed": fSetSelected("m"); sSetSelected("m"); break;
        }
    }

    const handleConvert = () => {
        console.log(form);
        const convert = new Convert(fSelected, sSelected, form);

        console.log("fSelected: " + fSelected)

        switch (mode) {
            case "distance": setTo(convert.distance()); break;
            case "mass": setTo(convert.mass()); break;
            case "temp": setTo(convert.temp()); break;
            case "time": setTo(convert.time()); break;
            case "money": setTo(convert.money(dollor, euro)); break;
            case "speed": setTo(convert.speed()); break;
        }

        console.log("to: " + to)
    }

    return (
        <main>
            <div className="title">
                <div className="title-background">
                    <h1>단위 변환</h1>
                </div>
        
                <div className="list">
                    <button onClick={handleMenu} className="distance">거리</button>
                    <button onClick={handleMenu} className="mass">질량</button>
                    <button onClick={handleMenu} className="temp">온도</button>
                    <button onClick={handleMenu} className="time">시간</button>
                    <button onClick={handleMenu} className="money">환율</button>
                    <button onClick={handleMenu} className="speed">속도</button>
                </div>
            </div>
        
            <div className="container">
                <div className="form">
                    <label htmlFor="form">Form</label>
                    <br/>
                    <div></div>
                    <input onChange={(e) => setForm(e.target.value)} id="form" type="number" />
                    <select className="mode-select s-1" onChange={(e) => fSetSelected(e.target.value)} value={fSelected}>
                        <Select mode={mode} />
                    </select>
                </div>
        
                <div className="form">
                    <label htmlFor="to">To</label>
                    <br/>
                    <div></div>
                    <input value={to} id="to" type="number" disabled />
                    <select className="mode-select s-2" onChange={(e) => sSetSelected(e.target.value)} value={sSelected}>
                        <Select mode={mode} />
                    </select>
                </div>
        
                <button className="convert" onClick={handleConvert}>Convert</button>
            </div>
      </main>
    )
}

export default App
