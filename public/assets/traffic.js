class Intersection 
{   
    constructor(CL) 
    {
     
      var CongestionLevel = CL;
      var  R1Cars = [];
      var  R2Cars = [];
      var   R3Cars = [];
      var   R4Cars = [];

    }  
        PopulateRoads(CarAmount) {
        var i;
        for (i = 0; i < CarAmount; i++) 
        {
          R1Cars[i] = 1;
          R2Cars[i] = 1;
          R4Cars[i] = 1;
          R3Cars[i] = 1;
        } 
      }

  }




  class TrafficController {
  constructor() 
  {
   var Intersections = [];
    for (var i = 0; i < 3; i++) 
    {
      let Inter = new Intersection(8);
      Intersections[i] = Inter;
      
      console.log("Created Inter!"); 
    }

  }

}
    


function TrafficCompute() {
    

  let TC = new TrafficController();
  console.log("Export Compute"); 
  var TimeToCross = 0;
  
  }


  function CalcDistanceToStop(Speed, Distance) {
//Speed is KM/H, Distance is KM
var speedMeters = Speed / 3.6;

//Assume Distance to traffic light is 1.5km

Distance = Distance * 1000; // Converting Km to M
var time = Distance / speedMeters;
//TrafficDelay time
var TrafficDelay = 7;
var TimeToStopLights = time - TrafficDelay;
console.log(TimeToStopLights); 
return TimeToStopLights;
    }
  export  {TrafficCompute, CalcDistanceToStop};