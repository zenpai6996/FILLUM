import { useState , useEffect} from 'react'
import React from "react";
import './App.css'
import Search from "./components/search.jsx";
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';


const API_BASE_URL ='https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS={
    method:'GET',
    headers:{
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}





const App = () => {
    const [SearchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm , setDebouncedSearchTerm] = useState('');

    //debounces the search term to prevents the user from making too many API requests
    useDebounce(() => setDebouncedSearchTerm(SearchTerm),500,[SearchTerm]);

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint = query
            ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`; 

            const response = await fetch(endpoint,API_OPTIONS);

            if(!response.ok){
                throw new Error('Failed to fetch movies');
            }

            const data= await response.json();
            if(data.response == 'False'){
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }
            setMovieList(data.results || []);
        }catch(error){
            console.error(`Error fetching movies ${error}`);
            setErrorMessage('Error fetching movies. Please try again later. ');
        }finally{
            setIsLoading(false);
        }
    }

   useEffect(() => {
    fetchMovies(debouncedSearchTerm);
   }, [debouncedSearchTerm]);
    
    return (
        <main>
            <div className="pattern"/>
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner"/>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without a hassle</h1>
                <Search searchTerm={SearchTerm} setSearchTerm={setSearchTerm}/>
                </header>
                <section className="all-movies">
                    <h2 className="mt-[40px]">All Movies</h2>
                    {isLoading ? (<Spinner/>):errorMessage?(<p className='text-red-500'>{errorMessage}</p>):<ul>
                        {movieList.map((movie) => (
                            <MovieCard key={movie.id} movie={movie}/>
                        ))}
                        </ul>}
                </section>
            </div>
        </main>
    )
}
export default App
