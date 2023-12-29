
/* 
Script for calculating rotation value from the difference of two (null) layers positions.

Handy (pun) e.g. for attaching a sword to the puppet pinned characters hand:

1. Use my script "puppet_pins_to_nulls.jsx" to get nulls from puppet pins.
2. First select the "sword" layer, second the "hand" null, and third the "arm" null. 
3. Run this script.
4. It creates an expression for the swords rotation value & creates layer effect for rotation offset control.
   The "sword" layer will be linked to the "hand" null (second selected layer).
*/


// Create script undo group
app.beginUndoGroup("Rotate by two nulls position");

// Get the active composition
var myComp = app.project.activeItem;

// Check if there's an active composition
if(myComp != null){
    // Get the selected layers
    var selectedLayers = myComp.selectedLayers;
    
    // Check if a layer is selected
    if(selectedLayers.length == 3){
        // Selected layers for the operations
        var swordLayer = selectedLayers[0];
        var handNull = selectedLayers[1];
        var armNull = selectedLayers[2];

        // Add Rotation offset slider effect to sword
        var myEffect = swordLayer.property("Effects").addProperty("Slider Control");
        myEffect.property("Slider").setValue(0);
        myEffect.name= "Rotation offset";

        // Expression for swords rotate parameter
        var expr = "var pos1 = thisComp.layer(\"" + handNull.name + "\").transform.position;\n";
        expr += "var pos2 = thisComp.layer(\"" + armNull.name + "\").transform.position;\n";
        expr += "var diff = pos2 - pos1;";
        expr += "var angle = Math.atan2(diff[1], diff[0]);\n";
        expr += "var angle_degrees = radiansToDegrees(angle);\n";
        expr += "angle_degrees+effect(\"" + myEffect.name + "\")(\"Slider\")"
        swordLayer.rotation.expression = expr;

        // Link sword to hand
        swordLayer.parent = handNull;
        
    } else {
        alert("Select 3 layers in this order:\n1. Sword, 2. Hand (null1), 3. Arm (null2)");
    }
} else {
    alert("No active composition.");
}

app.endUndoGroup();
