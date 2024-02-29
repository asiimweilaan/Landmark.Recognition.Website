import { WikipediaService } from './../wikipedia.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import * as mapboxgl from 'mapbox-gl';
import { MapboxResponse } from '../mapbox-response';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  result:any;
  selectedFile: File|null=null;
  uploadForm: FormGroup;
  searchResult:any;
  title:any;
  extract:any;
  explore = false;
  latitude:number=0;
  longitude:number=0;
  map: mapboxgl.Map | undefined;
  showPredictedClass: any[] = []; // the predicted class to be fetched from json
    

  constructor(private formBuilder:FormBuilder,private http:HttpClient, private wikipediaService:WikipediaService) {
    this.uploadForm = this.formBuilder.group({
      image:[null,Validators.required]
    })
    // mapboxgl.accessToken = 'pk.eyJ1IjoiaWxhYW4iLCJhIjoiY2x0NGU2NGF4MDI3bDJqbW5mcjhwbHhhYiJ9.cuD-CRK6ySylngkG9opl1A';
    // mapboxgl.accessToken = 'pk.eyJ1IjoiaWxhYW4iLCJhIjoiY2x0NGU2NGF4MDI3bDJqbW5mcjhwbHhhYiJ9.cuD-CRK6ySylngkG9opl1A';
    
  }
  
  // Other existing code...

  maxSentencesToShow = 1000; // Initial number of sentences to display
  currentSentencesDisplayed = this.maxSentencesToShow; // Current number of sentences displayed

  // Other existing methods...

  showMore() {
    // Increment the number of sentences to display by 3
    this.currentSentencesDisplayed += 1000;
  }

  search(term: string) {
    this.wikipediaService.search(term).subscribe((response: any) => {
      // Check if response contains pages
      if (response.query && response.query.pages) {
        // Get the first page ID
        const pageId = Object.keys(response.query.pages)[0];
        // Access title and extract using pageId
        this.title = response.query.pages[pageId].title;
        this.extract = this.stripHtmlTags(response.query.pages[pageId].extract);
        // Log or do something with title and extract
        // console.log(title);
        // console.log(extract);
      } else {
        console.log("No results found");
      }
    });
  }
  stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
  
  
  
  onFileSelect(event:Event) {
    const reader = new FileReader();
    if (event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0) {
      // const file = event.target.files[0];
      this.selectedFile = event.target.files[0]  ;
      this.uploadForm.get('image')!.setValue(this.selectedFile); // Set the selected file to the 'image' form control
      
      // console.log(this.selectedFile);
      // this.uploadForm.patchValue({

      // })
    }


    // let file: File | null = null;
    // if (event instanceof DragEvent) {
    //   const dataTransfer = event.dataTransfer;
    //   if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
    //     file = dataTransfer.files[0];
    //     this.displayImagePreview(file);
    //     console.log("run");
    //   }
    // } else if (event instanceof Event) {
    //   const inputElement = event.target as HTMLInputElement;
    //   if (inputElement.files && inputElement.files.length > 0) {
    //     file = inputElement.files[0];
    //     this.displayImagePreview(file);
    //   }
    // }
    // // Set the selected file in the form group
    // if (file) {
    //   this.selectedFile = file;
    //   this.uploadForm.get('image')!.setValue(this.selectedFile);
    //   // Trigger validation process
    //   this.uploadForm.get('image')!.updateValueAndValidity();
    // }
    // console.log(this.selectedFile);

    // const inputElement = event.target as HTMLInputElement;
    // if (inputElement.files && inputElement.files.length > 0) {
    //   const file = inputElement.files[0];
    //   this.selectedFile = file;
    //   this.uploadForm.get('image')!.setValue(file);
    //   // Trigger validation process
    //   this.uploadForm.get('image')!.updateValueAndValidity();
      
    //   // Display image preview if needed
    //   this.displayImagePreview(file);
    // }
  }

  onSubmit() {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }
    // console.log(this.uploadForm.get('image')!.value);
    const formData = new FormData();
    // formData.append('image', this.uploadForm.get('image')!.value);
    formData.append('file', this.selectedFile);
    // Make HTTP POST request using HttpClient
    this.http.post('http://localhost:8000/predict', formData, { withCredentials: true }).subscribe({
      next:(response:any)=>{
        console.log('Upload successful:', response);
        this.result=response;
        this.search(response.class);// parsing in the class that was predicted to the wiki api
      },
      error:(err)=>{console.error(err)}
    }
      // response => {
      //   console.log('Upload successful:', response);
        
      // },
      // error => {
      //   console.error('Error uploading image:', error);
      // }
    );
    this.explore = true;
  }


  // drag functionality

  imagePreviewUrl: string | ArrayBuffer | null = null;

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadForm.get('image')!.setValue(file);
      // Trigger validation process
      this.uploadForm.get('image')!.updateValueAndValidity();

      this.displayImagePreview(file);
      // this.uploadImage(file);
    }
  }

  displayImagePreview(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }
  // uploadImage(file: File) {
  //   if (!file) {
  //     console.error('No file dropped');
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   this.http.post('http://localhost:8000/predict', formData, { withCredentials: true }).subscribe({
  //     next: (response: any) => {
  //       console.log('Upload successful:', response);
  //       // Handle response if needed
  //     },
  //     error: (err) => {
  //       console.error(err);
  //     }
  //   });
  // }
  // Explore(){

  // }

  removeImage(){
    this.imagePreviewUrl = null;
    this.selectedFile = null;
    this.result = null;
    this.extract = null; 
    this.explore = false;
  }

  detectUserLocation() {
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
      // Get the user's current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Extract latitude and longitude from the position object
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          // Call a method to handle the user's location (e.g., pass it to the Google Maps API)
          // this.handleUserLocation(latitude, longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  handleUserLocation(latitude: number, longitude: number) {
    // Handle the user's location (e.g., pass it to the Google Maps API)
    // console.log('User location:', latitude, longitude);
    // Make HTTP request to Google Maps API
    // const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
    // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=point_of_interest&key=${apiKey}`;
    // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=point_of_interest|${this.result.class}&key=${apiKey}`;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}&types=place`;

    // Make an HTTP request to the Mapbox Geocoding API
    this.http.get<MapboxResponse>(url).subscribe({
      next:(response: MapboxResponse)=>{
        console.log('Mapbox response:', response);
        // Handle the response data and display nearby landmarks on the map
        this.loadPredictedOnMap();
        
      },
      error:(error) => {
        console.error('Error fetching nearby landmarks:', error);
      }
    }
    );
  }
  
  loadPredictedOnMap() {
    const predictedClass = this.result.class;
    // Load desert coordinates from the external JSON file
    this.http.get<any>('../../assets/data/classes.json').subscribe(data => {
      if (data.hasOwnProperty(predictedClass)) {
        this.showPredictedClass = data[predictedClass]; // Assign the desert coordinates to the deserts array
        this.displayLandmarksOnMap(); // Call the method to display landmarks on the map
      }
      else {
        console.error('Predicted class not found in the data response.');
      }
    });
  }

  displayLandmarksOnMap() {
    // Initialize an array to store the coordinates of desert locations
    const desertCoordinates: [number, number][] = [];
  
    // Loop through desert coordinates and add markers for each desert location on the map
    this.showPredictedClass.forEach(predictedClass => {
      // Push coordinates to the array
      desertCoordinates.push([predictedClass.longitude, predictedClass.latitude]);
  
      // Create a marker for each desert location
      const marker = new mapboxgl.Marker({ color: 'yellow' })
        .setLngLat([predictedClass.longitude, predictedClass.latitude])
        .addTo(this.map!);
  
      // Create a popup for the marker with the name of the desert location
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${predictedClass.name}</h3>`)
        .setMaxWidth('300px');
  
      // Attach the popup to the marker
      marker.setPopup(popup);
  
      console.log("showPredictedClass has run");
    });

    // Add a marker for your current location (if needed)
    new mapboxgl.Marker({ color: 'red' })
      .setLngLat([this.longitude, this.latitude])
      .addTo(this.map!);
  }

  ngOnInit(): void {
    this.detectUserLocation();
    
    // (mapboxgl as typeof mapboxgl).accessToken = 'sk.eyJ1IjoiaWxhYW4iLCJhIjoiY2x0NGc2a2JqMDJsbzJqbWpreXpuOXhsaSJ9.MpmGqBNPxqjqwaS49AyqoA';
    (mapboxgl as typeof mapboxgl).accessToken = 'pk.eyJ1IjoiaWxhYW4iLCJhIjoiY2x0NGR4NWlwMDFqeDJrbWprZTdqZTViNCJ9.r0JPDSTtBJ55N1wdxFolEQ'
    this.map = new mapboxgl.Map({
      // accessToken:'sk.eyJ1IjoiaWxhYW4iLCJhIjoiY2x0NGc2a2JqMDJsbzJqbWpreXpuOXhsaSJ9.MpmGqBNPxqjqwaS49AyqoA',
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9
    });
    // Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set('sk.eyJ1IjoiaWxhYW4iLCJhIjoiY2x0NGc2a2JqMDJsbzJqbWpreXpuOXhsaSJ9.MpmGqBNPxqjqwaS49AyqoA');
  }

}
