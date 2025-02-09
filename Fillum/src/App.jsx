import { useState , useEffect} from 'react'
import React from "react";
import './App.css'
import Search from "./components/search.jsx";
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';


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
    const [trendingMovies, setTrendingMovies] = useState([]);

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
                if(query && data.results.length>0){
                    await updateSearchCount(query,data.results[0]);
                }
        }catch(error){
            console.error(`Error fetching movies ${error}`);
            setErrorMessage('Error fetching movies. Please try again later. ');
        }finally{
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try{
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        }catch(error){
            console.error(`Error fetching trending movies : ${error}`);
        }
    }

   useEffect(() => {
    fetchMovies(debouncedSearchTerm);
   }, [debouncedSearchTerm]);

   useEffect(() => {
    loadTrendingMovies()
   }, []);
    
    return (
        <main>
            <div className="pattern"/>
            <div className="wrapper">
                <header className="relative flex flex-col items-center justify-center min-h-screen ">
                <div className="relative flex items-center justify-center w-full h-40 mb-8">
    {trendingMovies.slice(0, 5).map((movie, index) => (
        <React.Fragment key={movie.$id}>
            <img
                className={`absolute mt-10 w-30 sm:w-34 md:w-38 lg:w-42 xl:w-46 rounded-lg shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer ${
                    index === 0 ? '-rotate-10 -translate-x-[90%]' : 
                    index === 1 ? 'rotate-0 translate-x-0 z-15' : 
                    'rotate-10 translate-x-[90%]'
                }`}
                src={movie.poster}
                alt={movie.title}
            />
        </React.Fragment>
    ))}
</div>

                        <h1 className=" mt-15 text-8xl font-bold transition-transform duration-300 hover:scale-105 ease-out text-center text-gradient">Fillum</h1>
                        <h1 className="mt-5 text-3xl font-bold transition-transform duration-300 hover:scale-105 ease-out text-center">
                        Find the <span className="text-gradient">Movies</span> you want
                        </h1>
                <Search searchTerm={SearchTerm} setSearchTerm={setSearchTerm}/>
                </header>

                {
                    trendingMovies.length>0 && (
                        <section className="trending">
                            <h2>
                                Trending Movies
                            </h2>
                            <ul>
                                {
                                    trendingMovies.map((movie,index) => (
                                        <li key={movie.$id}>
                                            <p>{index+1}</p>
                                            <img className="transition delay-150 duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-105 cursor-pointer drop-shadow-lg" src={movie.poster} alt={movie.title} />
                                        </li>
                                    )
                                  )
                                }
                                
                            </ul>
                        </section>
                    ) 
                }

                <section className="all-movies">
                    <h2 >All Movies</h2>
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
