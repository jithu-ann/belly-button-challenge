// url
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

function init() {


    // Using d3 as dropdownmenu
    let dropdownMenu = d3.select("#selDataset");

    //Fetch and console
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let names = data.names;


        //Iterate through the array
        names.forEach((name) => {
            // Append each name as option to the dropdownmenu
            dropdownMenu.append("option").text(name).property("value", name);
        });

        //Assign the first name
        let name = names[0];

        //call the functions to make the demographic panel, bar chart, bubble chart
        demo(name);
        bar(name);
        bubble(name);
        gauge(name);
    });    
}

//make the demographic panel
function demo(selectedValue) {
    //Fetch and console
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let metadata = data.metadata;
        
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        // Assign the first object
        let obj = filteredData[0]
        
        d3.select("#sample-metadata").html("");
  
        let entries = Object.entries(obj);
        
        //Iterate through the entries array
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        console.log(entries);
    });
  }
  

//Make the bar chart
function bar(selectedValue) {
    //Fetch and console
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        //Array of sample objects
        let samples = data.samples;

        // Filter data where id = selected value
        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        //Assign the first object to obj
        let obj = filteredData[0];
        
        // Trace for the data for the horizontal bar chart
        let trace = [{
            //slice
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "rgb(166,172,237)"
            },
            orientation: "h"
        }];
        
        // Use plotly to plot the data in a bar chart
        Plotly.newPlot("bar", trace);
    });
}
  
//Make the bubble chart
function bubble(selectedValue) {

    //Fetch and console
    d3.json(url).then((data) => {

        //An array of sample object
        let samples = data.samples;
    
        // Filter data where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
    
        //Assign the first object to obj
        let obj = filteredData[0];
        
        // Trace for the data for the bubble chart
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "sunset"
            }
        }];    
    
       
        //Apply the x-axis to the layout
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        // Use plotly to plot the data in a bubble chart
        Plotly.newPlot("bubble", trace, layout);
    });
}
 
// Make the gauge chart
function gauge(selectedValue) {
    // Fetch and console
    d3.json(url).then((data) => {
        let metadata = data.metadata;
         
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        // Assign the first object to obj
        let obj = filteredData[0]

        // Trace for the data for the gauge chart
        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
            type: "indicator",
            mode: "gauge+number", 
            gauge: {
                axis: {range: [null, 10]},
                bar: {color: "rgb(68,166,198)"},
                steps: [
                    { range: [0, 1], color: "rgb(233,245,248)" },
                    { range: [1, 2], color: "rgb(218,237,244)" },
                    { range: [2, 3], color: "rgb(203,230,239)" },
                    { range: [3, 4], color: "rgb(188,223,235)" },
                    { range: [4, 5], color: "rgb(173,216,230)" },
                    { range: [5, 6], color: "rgb(158,209,225)" },
                    { range: [6, 7], color: "rgb(143,202,221)" },
                    { range: [7, 8], color: "rgb(128,195,216)" },
                    { range: [8, 9], color: "rgb(113,187,212)" },
                    { range: [9, 10], color: "rgb(98,180,207)" },
                    
                ]
            }
        }];

         // Use plotly to plot the data in a gauge chart
         Plotly.newPlot("gauge", trace);

    });
}

//new plots when option changed
function optionChanged(selectedValue) {
    demo(selectedValue);
    bar(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue)

}
init();