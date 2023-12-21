
// This AE script creates and links a null to each puppet pin on a selected layer 

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
                    var puppetPos = puppetPin.position.value;
                    var anchor = myLayer.transform.anchorPoint.value;
                    var posi = myLayer.transform.position.value;

                    // Calculate the position
                    var pos = [posi[0] + puppetPos[0] - anchor[0], posi[1] + puppetPos[1] - anchor[1]];

                    // Create a new null layer at the calculated position
                    var myNull = myComp.layers.addNull();
                    myNull.name = "Puppet Pin " + i + " Null";
                    myNull.transform.position.setValue(pos);
                    myNull.source.width = 70;
                    myNull.source.height = 70;

                    // Set the anchor point of the null to its center
                    myNull.transform.anchorPoint.setValue([myNull.source.width/2,myNull.source.height/2]);

                    // Assign a random label color to the null layer
                    myNull.label = getRandomInt(0, 15);

                    // Link the Puppet Pin position to the null layer position
                    var expr = "n=thisComp.layer(\"" + myNull.name + "\")\n";
                    expr += "nullpos=n.toComp(n.anchorPoint);\n";
                    expr += "fromComp(nullpos);";
                    puppetPin.position.expression = expr;
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
