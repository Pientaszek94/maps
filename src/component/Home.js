import React, { useRef, useState} from 'react'
import './Home.scss'
import {
    GoogleMap,
    Autocomplete,
    DirectionsRenderer, Marker
  } from '@react-google-maps/api';
import { Link } from 'react-router-dom';

function Home(props) {

    
    const ref = React.useRef(null);
    const originRef=useRef();
    const destinationRef=useRef();
    const refPanel=useRef();
    const refKliks=useRef();
    const refMoney=useRef();
    
    const [map, setMap] = React.useState();
    const [directionsRes, setDirectionsRes]=useState();
    const [distance, setDistance]=useState('');
    const [duration, setDuration]=useState('');
    const [cost, setCost]=useState();
    const [center, setCenter]=useState({});



    const [data, setData]=useState({});
    
    const directionService= new window.google.maps.DirectionsService();
    const directionsRen = new window.google.maps.DirectionsRenderer();
    
    
    
    
    
    React.useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        }


        navigator.geolocation.getCurrentPosition((position)=>{
            setCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        })

        sessionStorage.setItem('items', JSON.stringify(data));


    
        
    }, [data, ref, map]);
    

        
        const calculateRoute= async(e)=>{

            
                e.preventDefault();

                Clear();

                directionsRen.setPanel(refPanel.current);
                directionsRen.setMap(map);
                if(originRef.current.value===""||destinationRef.current.value==="") return;

                setData({
                    origin: originRef.current.value,
                    dest: destinationRef.current.value,
                    kliks: refKliks.current.value,
                    cost: refMoney.current.value
                })

                const request={
                    origin: originRef.current.value,
                    destination: destinationRef.current.value,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                    unitSystem: window.google.maps.UnitSystem.METRIC
                }
             

                directionService.route(request, (results, status)=>{
                    if(status==="OK"){
                        directionsRen.setDirections(results);
                    }
                    setDirectionsRes(results);
                    
                    
                    if(refMoney.current.value!==""){
                        var money=refMoney.current.value*results.routes[0].legs[0].distance.value/1000;
                        
                        setCost(money.toFixed(2));
                    }
                    else{

                        // constant value per Kilometer is 110% so 1km will cost 1,1units, ok?
                        money=(results.routes[0].legs[0].distance.value/1000)*1.1;
                        setCost(money.toFixed(2));
                    }


                    // Kilometers per day
                    if(refKliks.current.value!==""){

                        if(refKliks.current.value<=(results.routes[0].legs[0].distance.value/1000)){
                              
                                var km=results.routes[0].legs[0].distance.value/1000;
                               var days=Math.ceil(km/refKliks.current.value);
                            
                                setDuration(days+" day(s)");
                        }
                        else{
                                    setDuration(results.routes[0].legs[0].duration.text);
                        }
                    }
                    else{
                            
                            
                            // setDistance(results.routes[0].legs[0].distance.text);
                            setDuration(results.routes[0].legs[0].duration.text);
                            

                    }
                    setDistance(results.routes[0].legs[0].distance.text);
                    // END of Kilometers per day

                    
                        })



    }

    const Clear=()=>{
        setDirectionsRes();
        setDistance();
        setDuration();
        directionsRen.setMap(null);
        directionsRen.setPanel(null);
    }


// JSX *********************************************************
  return (
    
    <div>
        <div className='container'>
                <GoogleMap center={center}
                 zoom={20}
                 ref={ref}
                 mapContainerClassName="mapContainer"
                 >
                {directionsRes && <DirectionsRenderer directions={directionsRes}/>}
                <Marker position={center}/>
                </GoogleMap>
                <div ref={refPanel}></div>
               
        </div>
        <div className='destination-tab'>
            <form onSubmit={calculateRoute}>
                <Autocomplete>

                <input type="text" placeholder="Origin" ref={originRef}></input>
                </Autocomplete>

                <Autocomplete>
                <input type="text" placeholder="Destination" ref={destinationRef}></input>

                </Autocomplete>

                <input type="text" placeholder="Kilometers per day" ref={refKliks}></input>
                <input type="text" placeholder="cost per kilometer" ref={refMoney}></input>
                <button type="submit">Submit</button>
                <button type="reset" onClick={Clear}>Cancel</button>
            </form>
            <div>

                {distance && 
                <h5>
                    Distance: {distance}
                </h5>
                }
                

                {duration&&
                <h5>
                    Duration: {duration}
                </h5>
                
                }
                 {cost&&
                <h5>
                    Cost of journey: {cost} units
                </h5>
                
                }

                <Link to="/results" state={originRef.current}>
                <h4>KLiknij</h4>
                
                </Link>

            </div>
        </div>
    </div>
  )
}

export default Home;