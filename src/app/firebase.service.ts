import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import { ValueAccessor } from '@ionic/angular/dist/directives/control-value-accessors/value-accessor';


var database = firebase.database();
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  crimesList : Array<any> = []
  savedLocations : Array<any> = []
  tempArray : Array<any> = []
  constructor() { }

  //Retrieving data from firebase/// Types of crimes
  fetchCrimeCategories(){
  return firebase.database().ref().child('CrimeTypes').once('value').then(result =>{
      let string =  (JSON.stringify(result));
      let answer = JSON.parse(string)
      for(let key in answer){this.crimesList.push(key)}
      this.crimesList.push('Other')
      return this.crimesList
    }).catch(error =>{
      console.log(error);
      return error
    })
  }

  //Retrieving data from firebase/// Reported locations
  fetchSavedLocations(){
    firebase.database().ref().child('HighRisk').on('child_added', result=>{
      let locations = JSON.parse(JSON.stringify(result))
      console.log(locations);
     
      this.clearArray(this.tempArray)
      for(let key in locations){
        
        this.tempArray.push({
          place : Object.values(locations[key])
        })
      
      }
      console.log(this.tempArray);
     for(let i = 0; i < this.tempArray.length; i++){
      this.savedLocations.push({
        crimeType: this.tempArray[i].place[0],
        lat: this.tempArray[i].place[1],
        lng: this.tempArray[i].place[2]
      })
    }
      console.log(this.savedLocations);
      
    })
    return this.savedLocations
  }

  //Submitting data to firebase /// Pinning new report
  submit(){
    let userId = 'Willington'
    let place = 'Tembisa' 
    let description ='I done got raped'
    let lat = '2333423434.234234'
    let lng = '342432.34324'
    var newPostKey = firebase.database().ref().child('Category/' + userId + "/" + place + "/").push().key;
    firebase.database().ref().child('Category/' + userId + "/" + place + "/" + newPostKey + "/").update({
      description: description,
      lat : lat,
      lng : lng
    })
  }
  clearArray(array){
    for(let i=0; i < array.length; i++){array.splice(i)}
  }
}
