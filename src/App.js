import React,{useState, useEffect, useCallback} from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading]  = useState(false);
  const [error, setError] = useState(null);

  // const fetchMoviesHandler = () => {
  // setIsLoading(true);
  //   setError(null);
  //   fetch('https://www.swapi.tech/api/films')
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     const transformedMovies = data.result.map(movieData => {
  //       return {
  //         id: movieData.properties.episode_id,
  //         title: movieData.properties.title,
  //         openingText: movieData.properties.opening_crawl,
  //         releaseDate: movieData.properties.release_date
  //       }
  //     })

  //     setMovies(transformedMovies);
  //   })
  //   .catch((error) => {
  //     setError(error.message)
  //   })
  // setIsLoading(false);
  // }

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-test-f06a2-default-rtdb.firebaseio.com/movies.json')
      if(!response.ok) {
        throw new Error(`Something went wrong ${response.status}`)
      }
      const data = await response.json();
          
          const loadedMovies = [];

          for(const key in data) {
            loadedMovies.push({
              id: key,
              title: data[key].title,
              openingText: data[key].openingText,
              releaseDate: data[key].releaseDate,
            })
          }
        // const transformedMovies = data.result.map(movieData => {
        //   return {
        //     id: movieData.properties.episode_id,
        //     title: movieData.properties.title,
        //     openingText: movieData.properties.opening_crawl,
        //     releaseDate: movieData.properties.release_date
        //   }
        // })
  
        setMovies(loadedMovies);
    } catch (error) {
      setError(error.message)
  }
  setIsLoading(false);
}, [])

useEffect(() => {
  fetchMoviesHandler()
}, [fetchMoviesHandler])

async function addMovieHandler(movie) {
  setIsLoading(true);
  const response = await fetch('https://react-http-test-f06a2-default-rtdb.firebaseio.com/movies.json', {
    method: 'POST',
    body: JSON.stringify(movie),
    headers: {
      'Content-type': 'application/json'
    }
  })
  const data = await response.json();
  setIsLoading(false);
  console.log(data);

}

let content = <p>Found no movies...</p>

if (movies.length > 0) {
  content = <MoviesList movies={movies} />
}

if(error) {
  content = <p>{error}</p>
}

if(isLoading) {
  content = <p>Loading ...</p>
}


  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        {/* {!isLoading && <MoviesList movies={movies}/>}
        {error ? <p>{error}</p> : <MoviesList movies={movies}/> }
        {isLoading && <p>Loading ...</p>} */}
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
