import { useEffect } from "react";

declare global {
    interface Window {
      initMap: () => void
    }
  }

type Props = {
  queries: string[]
}

export default function Map({queries}: Props) {
  useEffect(() => {
    loadMap();
  }, [queries]);

  const googleMapsApiKey = "AIzaSyC57ZEWlM5UYjTnkwdZpO2M4fezr-AYlgA";

  const loadMap = () => {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap&libraries=places`;
    script.async = true;
    window.initMap = initMap;
    document.head.appendChild(script);
  };

  
  const initMap = () => {
    const sydney = new google.maps.LatLng(-33.867, 151.195);

    const infoWindow = new google.maps.InfoWindow();

    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: sydney,
        zoom: 8,
        mapTypeControl: false,
      }
    );

    const service = new google.maps.places.PlacesService(map);

    for (let i = 0; i < queries.length; i++) {

      const query = queries[i]??"";
      const request: google.maps.places.FindPlaceFromQueryRequest = {
        query,
        fields: ["name", "geometry", "photos"],
      };
      service.findPlaceFromQuery(
        request,
        (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < results.length; i++) {
              const result = results[i];
              if(!result) continue;
              createMarker(map, infoWindow, result)
            }
  
            map.setCenter(results[0]!.geometry!.location!);
          }
        }
      );  
    };  
  }
              

  const createMarker = (
    map: google.maps.Map,
    infowindow: google.maps.InfoWindow,
    place: google.maps.places.PlaceResult
  ) => {
    if (!place.geometry || !place.geometry.location || !place.photos) return;

    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      title: place.name,
      // icon: place.photos![0].getUrl({ maxWidth: 50, maxHeight: 50 }),
    });

    google.maps.event.addListener(marker, "click", () => {
      infowindow.setContent(place.name || "");
      infowindow.open(map);
    });

    return marker;
  };

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
}
