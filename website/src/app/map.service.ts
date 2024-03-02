import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapboxResponse } from './mapbox-response';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  selectedFile: File | null = null;
  result: any;
  latitude: number = 0;
  longitude: number = 0;
  predictedClass: any;

  constructor(private http:HttpClient) { }

  // handleUserLocation(latitude: number, longitude: number, result:string) {
    // this.latitude = latitude;
    // this.longitude = longitude;
    // this.predictedClass = result;
    // Handle the user's location (e.g., pass it to the Google Maps API)
    // console.log('User location:', latitude, longitude);
    // Make HTTP request to Google Maps API
    // const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
    // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=point_of_interest&key=${apiKey}`;
    // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=point_of_interest|${this.result.class}&key=${apiKey}`;
    // const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}&types=place`;

    // Make an HTTP request to the Mapbox Geocoding API
    // this.http.get<MapboxResponse>(url).subscribe({
    //   next:(response: MapboxResponse)=>{
    //     console.log('Mapbox response:', response);
    //     // Handle the response data and display nearby landmarks on the map
    //     // this.loadPredictedOnMap();
        
    //   },
    //   error:(error) => {
    //     console.error('Error fetching nearby landmarks:', error);
    //   }
    // }
    // );
    // this.functionACalledSource.next();
  // }

  // displayLandmarksOnMap() {
  //   // Initialize an array to store the coordinates of desert locations
  //   const desertCoordinates: [number, number][] = [];
  
  //   // Loop through desert coordinates and add markers for each desert location on the map
  //   this.showPredictedClass.forEach(predictedClass => {
  //     // Push coordinates to the array
  //     desertCoordinates.push([predictedClass.longitude, predictedClass.latitude]);
  
  //     // Create a marker for each desert location
  //     const marker = new mapboxgl.Marker({ color: 'yellow' })
  //       .setLngLat([predictedClass.longitude, predictedClass.latitude])
  //       .addTo(this.map!);
      
  //     this.markers.push(marker); //adding markers to array to remove them when picture is removed
      
  //       // Create a popup for the marker with the name of the desert location
  //     const popup = new mapboxgl.Popup({ offset: 25 })
  //       .setHTML(`<h4 class="text-bold" style="font-family: 
  //       'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  //       ">${predictedClass.name}</h4>`)
  //       .setMaxWidth('300px');
  
  //     // Attach the popup to the marker
  //     marker.setPopup(popup);
  
  //     console.log("showPredictedClass has run");
  //   });

  //   // Add a marker for your current location (if needed)
  //   const userLocationMarker = new mapboxgl.Marker({ color: 'red' })
  //     .setLngLat([this.longitude, this.latitude])
  //     .addTo(this.map!);
    
  //     const popup = new mapboxgl.Popup({ offset: 25 })
  //   .setHTML(`<h4 class="text-bold" style="font-family: 
  //   'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  //   ">You</h4>`)
  //   .setMaxWidth('300px');

  //   // Attach the popup to the marker
  //   userLocationMarker.setPopup(popup);
    
  //   this.markers.push(userLocationMarker);
  // }

  // removeMarkers() {
    // this.markers.forEach(marker => marker.remove()); // Remove each marker from the map
    // this.markers = []; // Clear the markers array
  // }
  // loadPredictedOnMap() {
    
  //   // Load desert coordinates from the external JSON file
  //   this.http.get<any>('../../assets/data/classes.json').subscribe(data => {
  //     if (data.hasOwnProperty(this.predictedClass)) {
  //       this.showPredictedClass = data[this.predictedClass]; // Assign the desert coordinates to the deserts array
  //       this.displayLandmarksOnMap(); // Call the method to display landmarks on the map
  //     }
  //     else {
  //       console.error('Predicted class not found in the data response.');
  //     }
  //   });
  // }
}
