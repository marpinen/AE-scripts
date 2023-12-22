
// This AE script is for easier puppet animation.
// It creates a null for each puppet pin on the selected layer and links them.
// Not very tested.

// Create script undo group
app.beginUndoGroup("Puppet pins to nulls");

// Get the active composition
var myComp = app.project.activeItem;

// Function to get a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Check if there's an active composition
if(myComp != null){
    // Get the selected layers
    var selectedLayers = myComp.selectedLayers;
    
    // Check if a layer is selected
    if(selectedLayers.length > 0){
        // Get the first selected layer
        var myLayer = selectedLayers[0];

        // Get the current rotation and scale of myLayer
        var myLrotation = myLayer.property("Transform").property("Rotation").value;
        var myLscale = myLayer.property("Transform").property("Scale").value;

        // Get the Puppet effect
        var puppetEffect = myLayer.effect("Puppet");

        // Check if the Puppet effect exists
        if(puppetEffect != null){
            // Get the mesh
            var mesh = puppetEffect.arap.mesh("Mesh 1");

            // Loop through all deform pins
            for(var i = 1; i <= mesh.numProperties; i++){
                // Get the Puppet Pin by index
                var puppetPin = mesh.deform("Puppet Pin " + i);
                
                // Check if the Puppet Pin exists
                if(puppetPin != null){

                    // Reset rotation and scale values of myLayer before operation
                    myLayer.property("Transform").property("Rotation").setValue(0);
                    myLayer.property("Transform").property("Scale").setValue([100, 100, 100]);

                    // Calculate the position (toComp and fromComp way would be more elegant)
                    var puppetPos = puppetPin.position.value;
                    var myLanchor = myLayer.transform.anchorPoint.value;
                    var myLpos = myLayer.transform.position.value;
                    var pos = [myLpos[0] + puppetPos[0] - myLanchor[0], myLpos[1] + puppetPos[1] - myLanchor[1]];

                    // Create a new null layer at the calculated position
                    var myNull = myComp.layers.addNull();
                    myNull.name = myLayer.name + " Pin " + i;
                    myNull.transform.position.setValue(pos);
                    myNull.source.width = 70;
                    myNull.source.height = 70;
                    myNull.moveBefore(myLayer);

                    // Set the anchor point of the null to its center
                    myNull.transform.anchorPoint.setValue([myNull.source.width/2,myNull.source.height/2]);

                    // Assign a random label color to the null layer
                    myNull.label = getRandomInt(0, 15);

                    // Link the Puppet Pin position to the null layer position
                    var expr = "n=thisComp.layer(\"" + myNull.name + "\")\n";
                    expr += "nullpos=n.toComp(n.anchorPoint);\n";
                    expr += "fromComp(nullpos);";
                    puppetPin.position.expression = expr;

                    // Link null to myLayer
                    myNull.parent = myLayer; 

                    // Set original rotation and scale values back to myLayer
                    myLayer.property("Transform").property("Rotation").setValue(myLrotation);
                    myLayer.property("Transform").property("Scale").setValue(myLscale);
                }
            }
        } else {
            alert("Puppet effect not found on the selected layer.");
        }
    } else {
        alert("No layer selected.");
    }
} else {
    alert("No active composition.");
}

app.endUndoGroup();
