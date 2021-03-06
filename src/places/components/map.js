import React ,{useRef,useEffect} from 'react'

const Map = (props) => {
    const mapRef=useRef();
    const{center,zoom}=props;

    console.log(center);

    useEffect(()=>{
        const map = new window.google.maps.Map(mapRef.current,{
        center:center,
        zoom:zoom
    });

    new window.google.maps.Marker({position:center,map:map});
    },[center,zoom])

    return (
        <div ref={mapRef} style={{width:"100%",height:"100%"}}>
            
        </div>
    )
}

export default Map;
