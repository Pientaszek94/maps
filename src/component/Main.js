import React, {useEffect, useReducer, useRef, useState } from 'react'
import {
    Autocomplete,
  } from '@react-google-maps/api'
  import './Main.scss'
  import {Link, useNavigate} from 'react-router-dom';

//   REDUX~useReducer(), ok? OK. Thank you.





function Main() {
  
  const navigate=useNavigate();

  const ACTIONS={
    ADD:'ADD'
  }

  
  const originRef=useRef(); // starting point
  const destinationRef=useRef();// ending point
  const refKliks=useRef();// Kilometers per day
  
  // const [origin, setOrigin]=useState('');
  // const [dest, setDest]=useState('');
  // const [kliks, setKliks]=useState('');
  
  const [data, setData]=useState(JSON.parse(sessionStorage.getItem('items')));
  const [show, setShow]=useState(false);
  
  const [list, dispatch]=useReducer(reducer, []);
  
  
  
      // REDUCER STUFF*************************
      
  
  
  function setNew(origin, dest, kliks){
    return {id: Date.now(), origin: origin, dest: dest, kliks: kliks}
  }
  
  function reducer(list, action){
    switch(action.type){
      case ACTIONS.ADD:
        let history= [setNew(action.payload.origin, action.payload.dest, action.payload.kliks)];
      return  sessionStorage.setItem("items", JSON.stringify(history))

        // sessionStorage.setItem("items", JSON.stringify([...list, setNew(action.payload.name, action.payload.age)]))
        // return [...list, setNew(action.payload.origin, action.payload.dest, action.payload.kliks)]
        // return history;
  
      default:
        return list
    }
  }
// END OF REDUX STUFF   
   
    const Reduce=(e)=>{

        e.preventDefault();
        
        dispatch({type: ACTIONS.ADD, payload:{origin: originRef.current.value, dest:destinationRef.current.value, kliks:refKliks.current.value}})
        // dispatch({type: ACTIONS.ADD, payload:{origin: originRef.current.value, dest:destinationRef.current.value, kliks:refKliks.current.value}})
        // sessionStorage.setItem("items", JSON.stringify(list))
        setShow(true);
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
                            {console.log(originRef)}
                           
                           {/* <Autocomplete>
                            <input type="text" placeholder="Where do you want to start?" value={origin} onChange={(e)=>setOrigin(e.target.value)}></input>
                            </Autocomplete>

                            <Autocomplete>
                            <input type="text" placeholder="Your destination?" value={dest} onChange={(e)=>setDest(e.target.value)}></input>
                            </Autocomplete>

                            <input type="number" placeholder="Kilometers a day?" value={kliks} onChange={(e)=>setKliks(e.target.value)}></input> */}
                           
                            <div className='buttons'>

                                <button type="submit" >
                                        Calculate
                                </button>
                                <button type="reset" onClick={()=>setShow(false)}>Cancel</button>
                            </div>
                       </form>
                       {show&&<Link to="/results" className='link'>Show me the map</Link>}
                       
                           {/* Here will be a search history */}
                        <div>
                        {data?<h3 style={{textAlign:'center'}}>Your previous search</h3>:null}
                        {data?data.map((item)=>(
                              <div style={{color:'blue', fontWeight:"bolder"}} key={item.id}>
                                    <h4 style={{textAlign:'center'}}>
                                    Start: {item.origin}<br/>
                                    Finish: {item.dest}

                                    </h4>
                              </div>
                        )):null}
                        </div>
            </div>   
    </div>
  )
}

export default Main