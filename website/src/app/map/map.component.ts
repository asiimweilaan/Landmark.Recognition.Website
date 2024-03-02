import { MapService } from './../map.service';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
// import { MapboxResponse } from '../mapbox-response';
// import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: mapboxgl.Map | undefined;
  selectedFile: File | null = null;
  result: any;
  latitude: number = 0;
  longitude: number = 0;
  
   

  constructor(private http:HttpClient, private mapService:MapService) { }

  ngOnInit(): void {
    
    (mapboxgl as typeof mapboxgl).accessToken = 'pk.eyJ1IjoiaWxhYW4iLCJhIjoiY2x0NGR4NWlwMDFqeDJrbWprZTdqZTViNCJ9.r0JPDSTtBJ55N1wdxFolEQ'
    this.map = new mapboxgl.Map({
      // accessToken:'sk.eyJ1IjoiaWxhYW4iLCJhIjoiY2x0NGc2a2JqMDJsbzJqbWpreXpuOXhsaSJ9.MpmGqBNPxqjqwaS49AyqoA',
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 0
    });

    this.selectedFile = this.mapService.selectedFile;
    this.result = this.mapService.result;
    this.latitude = this.mapService.latitude;
    this.longitude = this.mapService.longitude;

    this.addMarkers();
    
  }

  addMarkers() {
    // console.log(this.mapService.predictedClass);
    let showPredictedClass: any[] = [];
    // Load desert coordinates from the external JSON file
    this.http.get<any>('../../assets/data/classes.json').subscribe(data => {
      if (data.hasOwnProperty(this.mapService.predictedClass)) {
        
        showPredictedClass = data[this.mapService.predictedClass]; // Assign the desert coordinates to the deserts array
        console.log(showPredictedClass);
        // this.displayLandmarksOnMap(); // Call the method to display landmarks on the map
        
        //------- calling this function scope of adding markers to landmarks since this function is async --------
        // console.log(showPredictedClass);
        // Add markers for predicted class locations
        const predictedClassCoordinates = showPredictedClass // Assuming you have an array of coordinates
        const desertCoordinates: [number, number][] = [];
        
        predictedClassCoordinates.forEach(coord => {
          desertCoordinates.push([coord.longitude, coord.latitude]);

          const marker = new mapboxgl.Marker({ color: 'yellow' })
            .setLngLat([coord.longitude, coord.latitude])
            .addTo(this.map!);

          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h4 class="text-bold" style="font-family: 
            'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            ">${coord.name}</h4>`)
            .setMaxWidth('300px');

          marker.setPopup(popup); //applying the popups to the markers
        });

      }
      else {
        console.error('Predicted class not found in the data response.');
      }
    });
    // console.log(showPredictedClass);

    if (navigator.geolocation) {
      // Get the user's current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Extract latitude and longitude from the position object
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;

          if (this.map && this.result) {
      
            // Add marker for user's location
            // console.log(this.longitude, this.latitude);
            const userMarker = new mapboxgl.Marker({ color: 'red' })
              .setLngLat([this.longitude, this.latitude])
              .addTo(this.map!);
            const userpopup = new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<h4 class="text-bold" style="font-family: 
              'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
              ">You</h4>`)
              .setMaxWidth('300px');
      
            userMarker.setPopup(userpopup); // applying the popups to the user marker 
          }
          // this.navigateToMapComponent();
          // const updatedData = {
          //   predictedClass: this.result.class,
          //   predictedImage: '',
          //   longitude: this.longitude.toString(),
          //   latitude: this.latitude.toString()
          // }

          // Call a method to handle the user's location (e.g., pass it to the Google Maps API)
          // this.handleUserLocation(latitude, longitude);
          // this.mapService.handleUserLocation(this.latitude,this.longitude,this.result.class);
          // this.http.put("../../assets/data/currentproperties.json",updatedData).subscribe(
          //   {
          //     next:(response)=>{console.log("JSON updated successfully")},
          //     error:(error)=>{console.log(error)}
          //   }
          // );
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
      
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    // if (this.map && this.result) {
      
    //   // Add marker for user's location
    //   // console.log(this.longitude, this.latitude);
    //   const userMarker = new mapboxgl.Marker({ color: 'red' })
    //     .setLngLat([this.longitude, this.latitude])
    //     .addTo(this.map!);
    //   const userpopup = new mapboxgl.Popup({ offset: 25 })
    //     .setHTML(`<h4 class="text-bold" style="font-family: 
    //     'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    //     ">You</h4>`)
    //     .setMaxWidth('300px');

    //   userMarker.setPopup(userpopup); // applying the popups to the user marker 
    // }
  }
  markPointsOnMap(){
    
  }
}
