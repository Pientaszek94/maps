import React, { useEffect, useReducer, useRef, useState } from 'react'
import {
    Autocomplete,
  } from '@react-google-maps/api'
  import './Main.scss'
  import {Link} from 'react-router-dom';
  import Lis from './Lis'

//   REDUX~useReducer(), ok? OK. Thank you.





function Main() {



// REDUX STUFF
const ACTIONS={
    ADD:'ADD'
  }
  
  
  function setNew(origin, dest, kliks){
    return {id: Date.now(), origin: origin, dest: dest, kliks: kliks}
  }
  
  function reducer(list, action){
    switch(action.type){
      case ACTIONS.ADD:
        return [...list, setNew(action.payload.origin, action.payload.dest, action.payload.kliks)]
  
      default:
        return list
    }
  }
// END OF REDUX STUFF   




    const originRef=useRef(); // starting point
    const destinationRef=useRef();// endfing point
    const refKliks=useRef();// Kilimeters per day

    const [data, setData]=useState({});

    // const [origin, setOrigin]=useState('');
    // const [dest, setDest]=useState('');
    // const [kliks, setKliks]=useState('');



    // REDUCER STUFF*************************
    const [list, dispatch]=useReducer(reducer, []);
    
    
    useEffect(()=>{
        
        
        setData({
            origin: originRef.current.value,
            dest: destinationRef.current.value,
            kliks: refKliks.current.value,
             })
        
        sessionStorage.setItem('items', JSON.stringify(data));
        
        // JSON.parse(sessionStorage.getItem('items'));
        
        
        
        
        
    }, [data])
    
    
    const Clear=()=>{
        setData();
        sessionStorage.clear()  
    }
    
    const Reduce=()=>{
        
        dispatch({type: ACTIONS.ADD, payload:{origin: originRef.current.value, dest:destinationRef.current.value, kliks:refKliks.current.value}})
    }
    
  return (
    <div className='main'>
            <div className="main-container">

                <h1>HELLO, STRIDER!</h1>
                       <form onSubmit={Reduce}>
                            <Autocomplete>

                            <input type="text" placeholder="Where do you want to start?" ref={originRef}></input>
                            </Autocomplete>

                            <Autocomplete>
                            <input type="text" placeholder="Your destination?" ref={destinationRef}></input>

                            </Autocomplete>

                            <input type="number" placeholder="Kilometers a day?" ref={refKliks}></input>
                            <div className='buttons'>

                                
                                <button type="button" onClick={Reduce}>
                                        <Link to="/results" className='link'>
                                        Show me the map
                                        </Link>
                                </button>
                                <button type="reset" onClick={Clear}>Cancel</button>
                            </div>
                       </form>
                            <div>
                            {list.map(lis=>(
                                <Lis key={lis.id} lis={lis}/>    
                            ))}
                            </div>                       
                        
            </div>   
    </div>
  )
}

export default Main