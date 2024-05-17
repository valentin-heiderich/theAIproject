
// A neuron class represents a neuron in the network
class Neuron{
    constructor(network){
        this.network = network; // reference to the network
        this.weights = []; // weights of the neuron to the previous layer neurons
        this.bias = Math.random()*2-1; // bias of the neuron
        this.output = 0; // output of the neuron
    }
}

// Layer class represents a layer in the network holding some neurons
class Layer{
    constructor(network, ln, nc){
        this.network = network; // reference to the network
        this.ln = ln; // layer number
        this.prevLayer = null; // reference to the previous layer
        this.nextLayer = null; // reference to the next layer
        this.neurons = [...Array(nc)].map(()=>new Neuron(network)); // neurons in the layer
    }

    // Populate the weights of the neurons in the layer randomly
    populateWeights(){
        if(!this.prevLayer) return; // the input layer has no weights since it has no previous layer
        this.neurons.forEach(neuron=>{
            neuron.weights = [...Array(this.prevLayer.neurons.length)].map(()=>Math.random()*2-1); // random weights
        });
    }

    // Forward pass on the layer
    forward(){
        this.neurons.forEach(neuron=>{
            let sum = neuron.bias;  // starting the sum with the bias
            this.prevLayer.neurons.forEach((prevNeuron, i)=>{sum += prevNeuron.output * neuron.weights[i];}); // calculating the out
            neuron.output = Math.max(0, sum); // ReLU to scale the output and make it between -1 and 1
        });
    }
}

class Network{
    constructor(ps){
        this.inputNodes = new Layer(this, 0, ps); // input layer
        this.hiddenLayers = [new Layer(this, 1, 32), new Layer(this, 2, 16)]; // hidden layers
        this.outputNodes = new Layer(this, 3, 10); // output layer
        this.layers = [this.inputNodes, ...this.hiddenLayers, this.outputNodes]; // all layers in the network
        // Discover prev and next layers and populate the weights randomly
        this.layers.forEach((layer, i)=>{
            if(i>0) layer.prevLayer = this.layers[i-1]; // set the previous layer
            if(i<this.layers.length-1) layer.nextLayer = this.layers[i+1];  // set the next layer
            layer.populateWeights(); // populate the weights
        });
    }

    giveInput(input){
        this.inputNodes.neurons.forEach((neuron, i)=>neuron.output = input[i]);  // set the input layer outputs
    }

    // Forward pass on the network
    forward(){
        // no need to forward the input layer since it has no previous layer
        this.hiddenLayers.forEach(layer=>layer.forward());  // forward pass on the hidden layers
        this.outputNodes.forward();  // forward pass on the output layer
        return this.outputNodes.neurons.map(neuron=>neuron.output); // return the output layer outs
    }
}

// Network Manager (Main Thread)
let network = null;
self.onmessage = function(e){
    switch(e.data.type){
        case "create":
            network = new Network(e.data.pds);
            break;
        case "forward":
            network.giveInput(e.data.input);
            console.log(e.data.input);
            let output = network.forward();
            self.postMessage({type: "forward", output: output});
            break;
    }
}