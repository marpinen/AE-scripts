// Script for adding elastic motion for layers, using the "global function in the layer marker comment" -method. 
// The script first adds slider controls to the current layer for controlling the elastic motion.
// Then checks if "Global" and "elastic expression master" layers exists. If not, creates them.
// The Global layer contains the elastic function in the marker comment in frame 1.
// The "elastic expression master" layer controls the global elastic settings. If the layer does not exist, then uses local value.


// Create script undo group
app.beginUndoGroup("Elastic motion");

// Add properties to current layer
// Get current layer
var currentLayer = app.project.activeItem.selectedLayers[0];

// Add a slider control effects
var ampSlider = currentLayer.Effects.addProperty("ADBE Slider Control");
ampSlider.name = "Amp";
var ampIndex = ampSlider.propertyIndex;

var freqSlider = currentLayer.Effects.addProperty("ADBE Slider Control");
freqSlider.name = "Freq";
var freqIndex = freqSlider.propertyIndex;

var decaySlider = currentLayer.Effects.addProperty("ADBE Slider Control");
decaySlider.name = "Decay";
var decayIndex = decaySlider.propertyIndex;

// Set the expressions for the for the Amp, Freq and Decay sliders
currentLayer.effect(ampIndex)("Slider").expression = 'try{\
	thisComp.layer("elastic expression master").effect("Amp")("Slider")\
}catch(err){\
	effect("Amp")("Slider")\
}';

currentLayer.effect(freqIndex)("Slider").expression = 'try{\
	thisComp.layer("elastic expression master").effect("Freq")("Slider")\
}catch(err){\
	effect("Freq")("Slider")\
}';

currentLayer.effect(decayIndex)("Slider").expression = 'try{\
	thisComp.layer("elastic expression master").effect("Decay")("Slider")\
}catch(err){\
	effect("Decay")("Slider")\
}';

// Set default values for the Amp, Freq and Decay sliders
currentLayer.effect(ampIndex)("Slider").setValue(0.05);
currentLayer.effect(freqIndex)("Slider").setValue(6.00);
currentLayer.effect(decayIndex)("Slider").setValue(8.00);

// Set the expressions for the position, scale and rotation properties
currentLayer.transform.position.expression = 'eval(thisComp.layer("Global").marker.key(1).comment)\
transform.xPosition, transform.yPosition, transform.zPosition = elastic(effect("Amp")("Slider"), effect("Freq")("Slider"), effect("Decay")("Slider"))';

currentLayer.transform.scale.expression = 'eval(thisComp.layer("Global").marker.key(1).comment)\
elastic(effect("Amp")("Slider"), effect("Freq")("Slider"), effect("Decay")("Slider"))';

currentLayer.transform.rotation.expression = 'eval(thisComp.layer("Global").marker.key(1).comment)\
transform.xRotation, transform.yRotation, transform.zRotation = elastic(effect("Amp")("Slider"), effect("Freq")("Slider"), effect("Decay")("Slider"))';


// Try to add Global and Elastic expression master layers if not exist
// Elastic function
var elaFunktio = 'function elastic(amp, freq, decay){\
n = 0;\
if (numKeys > 0){\
n = nearestKey(time).index;\
if (key(n).time > time){\
n--;\
}}\
if (n == 0){ t = 0;\
}else{\
t = time - key(n).time;\
}\
if (n > 0 && t < 1){\
v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\
return value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);\
}else{value}\
return value;\
}'

// Add elastic expression master layer with sliders
if (app.project.activeItem.layer("elastic expression master") == null){

    var myComp = app.project.activeItem;
    var myNull = myComp.layers.addNull(myComp.duration);
    myNull.name= "elastic expression master";

    var myEffect = myNull.property("Effects").addProperty("Slider Control");
    myEffect.property("Slider").setValue(0.05);
    myEffect.name= "Amp";

    var myEffect = myNull.property("Effects").addProperty("Slider Control");
    myEffect.property("Slider").setValue(6.00);
    myEffect.name= "Freq";

    var myEffect = myNull.property("Effects").addProperty("Slider Control");
    myEffect.property("Slider").setValue(8.00);
    myEffect.name= "Decay";

    myNull.enabled = false;
}

// Add Global layer for functions
if (app.project.activeItem.layer("Global") == null){

    var myComp = app.project.activeItem;
    var myNull = myComp.layers.addNull(myComp.duration);
    myNull.name= "Global";

    // Add a marker to frame 0 with global elastic function in comment
    var myLayer = app.project.activeItem.selectedLayers[0];
    var myMarkerVal = new MarkerValue(elaFunktio);
    myLayer.property("Marker").setValueAtTime(0, myMarkerVal);

    myNull.enabled = false;
    myNull.locked = true;
}

app.endUndoGroup();