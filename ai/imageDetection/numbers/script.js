// Load the canvas and output elements from the HTML file
let canvas = document.getElementById("canvas");  // Canvas
let output = document.getElementById("output");  // Output

// Canvas Drawing
let ctx = canvas.getContext("2d"); // Canvas Context
let w = canvas.width; let h = canvas.height; // Width and Height of the canvas

window.addEventListener('load', ()=>{
    resize(); // Resize the canvas when the window loads
    document.addEventListener('mousedown', md); // Mouse down event => start painting
    document.addEventListener('mouseup', mu); // Mouse up event => stop painting, forward the image to the network
    document.addEventListener('mousemove', draw); // Mouse move event => draw on the canvas
    window.addEventListener('resize', resize); // Resize Event => resize the canvas
});

// Resize the canvas
function resize(){
    ctx.canvas.width = window.innerWidth; // Set the canvas width to the window width
    ctx.canvas.height = window.innerHeight; // Set the canvas height to the window height
    w = canvas.width; h = canvas.height; // Update the width and height variables
    nm.postMessage({type: "create" , pds: w * h}); // Create new network of proper size => needs to be reworked since only the input layer size should be changed
}

let mouse = {x:0 , y:0}; // Mouse Position
let mdb = false; // Mouse Down Boolean

// Get the mouse position
function getPosition(event){
    mouse.x = event.clientX; // Get the x position of the mouse
    mouse.y = event.clientY; // Get the y position of the mouse
}

function md(event){mdb = true;getPosition(event);} // Mouse Down function => set the mouse down boolean to true and get the mouse position
function mu(){ // Mouse Up function => set the mouse down boolean to false and forward the image to the network
    mdb = false;  // Set the mouse down boolean to false
    let _id = ctx.getImageData(0, 0, w, h).data; // Get the image data of the canvas
    console.log(_id); // Log the image data to the console => Inspection needed somehow the bottom data is not really influencing the output
    nm.postMessage({type: "forward", input: _id}); // Forward the image data to the network
}

function draw(event){
    if (!mdb) return; // If the mouse is not down, return
    ctx.beginPath(); // Start a new path
    ctx.lineWidth = 5; // Set the line width to 5
    ctx.lineCap = 'round'; // Set the line cap to round
    ctx.strokeStyle = 'white'; // Set the stroke style to white
    ctx.moveTo(mouse.x, mouse.y); // Move the path to the last mouse position
    getPosition(event); // Get the new mouse position
    ctx.lineTo(mouse.x , mouse.y); // Draw a line from the old to the new mouse position
    ctx.stroke(); // Stroke the path
}

// Network Manager (Worker)
const nm = new Worker("network.js"); // Create a new worker from the network.js file
nm.postMessage({type: "create" , pds: w * h}); // Create new network of proper size => needs to be reworked since only the input layer size should be changed
nm.onmessage = function(e){ // On message event => handle the message
    switch(e.data.type){ // Switch on the data type
        case "forward": // If the data type is forward => update the output element with the output of the network
            let _out = e.data.output.map(o=>o.toFixed(2)); // Map the output to a string with 2 decimal places
            output.innerHTML = "["+_out+"]"; // Update the output element with the output of the network
            break; // Break the switch statement
    }
}
