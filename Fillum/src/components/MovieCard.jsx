import React from 'react'

const MovieCard = ({movie:{title,vote_average,poster_path,release_date,original_language}}) => {
  return (
  <div className='movie-card group'>
   <img 
   src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}`:'/no-movie.png'} alt={title} />
   <div className="mt-4">
    <h3 className="group-hover:text-purple-950 transition delay-150 duration-300 ease-in-out ">{title}</h3>
    <div className="content ">
      <div className="rating">
        <img src="star.svg" alt="Star Icon" />
        <p className='group-hover:text-purple-950 transition delay-150 duration-300 ease-in-out '>{vote_average ? vote_average.toFixed(1):'N/A'}</p>
      </div>
      <span className='text-2xl group-hover:text-black transition delay-150 duration-300 ease-in-out '>•</span>
      <p className='lang group-hover:text-black transition delay-150 duration-300 ease-in-out '>{original_language}</p>
      <span className='text-2xl group-hover:text-black transition delay-150 duration-300 ease-in-out '>‣</span>
      <p className='year group-hover:text-black transition delay-150 duration-300 ease-in-out '>
        {release_date ? release_date.split('-')[0] : 'N/A' }
      </p>
    </div>
   </div>
  </div>
  )
}

export default MovieCard