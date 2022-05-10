import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function Results(props) {

    const [data, setData]=useState({});

    useEffect(()=>{

        const items=JSON.parse(sessionStorage.getItem('items'));
        if(items){
            setData(items);
        }


    }, [])
  return (
    <div>Lapapa
      
      <h1>{data.origin}</h1>
      <h1>{data.dest}</h1>
      <h1>{data.kliks}</h1>
        <Link to="/">HOME</Link>
    </div>
  )
}

export default Results;