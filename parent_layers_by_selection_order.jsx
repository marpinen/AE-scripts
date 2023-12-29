
/* 
Script for parenting selected layers by selection order.
Might come handy for animation rigs etc.
First select master parent, and then all the child layers in the right order.
*/

// Create script undo group
app.beginUndoGroup("Parent layers by selection order");

// Get the active composition
var myComp = app.project.activeItem;

// Check if there's an active composition
if(myComp != null){
    // Get the selected layers
    var selectedLayers = myComp.selectedLayers;
    
    // Check if two or more layers are selected
    if(selectedLayers.length >= 2){

        // Loop through all layers
        for(var i = 0; i < selectedLayers.length - 1; i++){

            // Get current parent and child layers
            var parentLayer = selectedLayers[i];
            var childLayer = selectedLayers[i+1];
            // alert("Parent: " + parentLayer.name + ", Child: " + childLayer.name);

            // Link child to parent
            childLayer.parent = parentLayer;
        }
       
    } else {
        alert("Select two or more layers in the right order");
    }
} else {
    alert("No active composition.");
}

app.endUndoGroup();
