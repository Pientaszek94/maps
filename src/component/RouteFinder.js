import React, { useRef, useState, useEffect} from 'react'
import './RouteFinder.scss'
import {
    GoogleMap,
    DirectionsRenderer, 
    Marker
  } from '@react-google-maps/api';
import { Link } from 'react-router-dom';

function RouteFinder() {

  const ref = React.useRef(null);
  const refPanel=useRef();
  const refMoney=useRef();
  
  
  const [map, setMap] = React.useState();
  const [directionsRes, setDirectionsRes]=useState();
  const [distance, setDistance]=useState('');
  const [duration, setDuration]=useState('');
  const [cost, setCost]=useState();
  const [center, setCenter]=useState({});
  const [kliks, setKliks]=useState();
  
  
  
  const directionService= new window.google.maps.DirectionsService();
  const directionsRen = new window.google.maps.DirectionsRenderer();
  
  const [data, setData]=useState(JSON.parse(sessionStorage.getItem('items')));

    
  useEffect(() => {
    // if (ref.current && !map) {
    //     setMap(new window.google.maps.Map(ref.current, {}));
    // }


    const items=JSON.parse(sessionStorage.getItem('items'));
    if(items){
        setData(items);
    }


    navigator.geolocation.getCurrentPosition((position)=>{
        setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    })

    calculateRoute();
    
    
  }, [ref, map]);
  
  
  


  
  const calculateRoute=()=>{

                directionsRen.setPanel(refPanel.current);
                // directionsRen.setMap(map);
                if(data.origin===""||data.dest==="") return;

                const request={
                    origin: data[0].origin,
                    destination: data[0].dest,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                    unitSystem: window.google.maps.UnitSystem.METRIC
                }
             

                directionService.route(request, (results, status)=>{
                    if(status==="OK"){
                        directionsRen.setDirections(results);
                    }
                    setDirectionsRes(results);
                    
                    


                    // Kilometers per day
                    if(data[0].kliks!==""){

                        if(data[0].kliks<=(results.routes[0].legs[0].distance.value/1000)){
                              
                                var km=results.routes[0].legs[0].distance.value/1000;
                               var days=Math.ceil(km/data[0].kliks);
                            
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
                    setKliks(results.routes[0].legs[0].distance.value)
                    // END of Kilometers per day
                    console.log(typeof(kliks))

                    
                        })



    }

    const MoneyCounter=()=>{


      if(refMoney.current.value!==""){
        var money=refMoney.current.value*(kliks/1000);
        
        setCost(money.toFixed(2)+"units");
    }
    else{

        // constant value per Kilometer is 110% so 1km will cost 1,1units, ok?
        money=(kliks/1000)*1.1;
        setCost(money.toFixed(2)+" units (110% of distance)");
    }
    }



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
               
        </div>
        


        <div className='whole-container'>
            <div className='results-container'>
                <div className='home'>
                  <button type='button'><Link to="/maps">Go back</Link></button>
                </div>
                    <input type="number" placeholder="price per kilometer" min={0.1} step={0.1} ref={refMoney} onChange={MoneyCounter}></input>  
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
                                Cost of journey: {cost}
                            </h5>
                            
                          }
                          <button type='button' onClick={()=>{window.print()}}>PRINT</button>
              </div>

        </div>

                          <div ref={refPanel}></div>

    </div>
  )
}

export default RouteFinder