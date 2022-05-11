import './App.scss';
import React, { useState } from 'react';
import {useLoadScript} from '@react-google-maps/api';
import Main from './component/Main';
import Results from './component/RouteFinder';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'


function App() {


  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: "AIzaSyBG0vrGNyiNOwqWdvE3ckxK9TspuDEDPwE",
  //   libraries: ['places']
  // })

  const [libraries]=useState(['places']);


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries
  })


  if(!isLoaded) return <div>Loading</div>


  return (
    <div className="App">
      
      <Router>
            <Routes>
                    <Route path="/maps" exact element={<Main/>}/>
                    <Route path="/results" exact element={<Results/>}/>
            </Routes>
      </Router> 


    </div>
  );
}

export default App;
