import { useState , useEffect} from 'react'
import React from "react";
import './App.css'
import Search from "./components/search.jsx";

const App = () => {
    const [SearchTerm, setSearchTerm] = useState('');

   useEffect(() => {

   }, []);
    
    return (
        <main>
            <div className="pattern"/>
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner"/>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without a hassle</h1>
                </header>
                <Search searchTerm={SearchTerm} setSearchTerm={setSearchTerm}/>
            </div>
        </main>
    )
}
export default App
