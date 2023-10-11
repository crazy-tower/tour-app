'use client';

import { useEffect } from "react";

export default function Map() {
  useEffect(() => {
    loadMap();
  }, []);

  const loadMap = () => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC57ZEWlM5UYjTnkwdZpO2M4fezr-AYlgA&callback=initMap`;
    script.async = true;
    window.initMap = function() {
      new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      });
    };
    document.head.appendChild(script);
  };

  return (
    <div id="map" style={{height: '100vh', width: '100%'}}></div>
  );
}
