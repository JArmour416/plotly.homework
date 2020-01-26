// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("samples.json").then((importedData) => {
    console.log(importedData);
});

// Use slice() to Grab the Top 10 samples
d3.json("samples.json").then(function(data) {
    console.log(data.samples[0].otu_ids.slice(0, 10));
    console.log(data.samples[0].sample_values.slice(0, 10));
    console.log(data.samples[0].otu_labels.slice(0, 10));

    // Populate dropdown list with sample IDs
    var selDataset = d3.select("#selDataset")
    selDataset.selectAll("option")
        .data(data.names)
        .enter().append("option")
        .attr("value", function(d){return d;})
        .text(function(d){return d;})
    
    populateDemographicInfo(data, 0);
    plotBarGraph(data, 0);
    plotBubbleGraph(data, 0);
    plotGaugeGraph(data, 0);
})

//--------------------------------------------------------
// Use d3 to select the panel with ID of `#sample-metadata
//--------------------------------------------------------

function optionChanged(id) {
    var sampleMetadata = d3.select("#sample-metadata");

    d3.json("samples.json").then(function(data) {
        console.log(data.names);
        var index = data.names.indexOf(id);
        console.log(index);

        populateDemographicInfo(data, index);
        plotBarGraph(data, index);
        plotBubbleGraph(data, index);
        plotGaugeGraph(data, index);
    })
}

//--------------------------------------------------
// Populate Demographic info for test Subject
//---------------------------------------------------

function populateDemographicInfo(data, index){
    var sampleMetadata = d3.select("#sample-metadata");
    var filteredData = data.metadata[index];

    console.log(filteredData);

        //----------------------
        //clear existing data
        //----------------------
        sampleMetadata.html("");

    sampleMetadata.append("ul").html(`<b>id:</b> ${filteredData.id}`);
    sampleMetadata.append("ul").html(`<b>ethnicity:</b> ${filteredData.ethnicity}`);
    sampleMetadata.append("ul").html(`<b>gender:</b> ${filteredData.gender}`);
    sampleMetadata.append("ul").html(`<b>age:</b> ${filteredData.age}`);
    sampleMetadata.append("ul").html(`<b>location:</b> ${filteredData.location}`);
    sampleMetadata.append("ul").html(`<b>bbtype:</b> ${filteredData.bbtype}`);
    sampleMetadata.append("ul").html(`<b>wfreq:</b> ${filteredData.wfreq}`);
}
//--------------------------------------------------
// Build Bar graph for 10 samples
//---------------------------------------------------

function plotBarGraph(data, index) {
    var otu_ids = data.samples[index].otu_ids.slice(0,10).map(id => `OTU ID ${id}`);
    var sample_values = data.samples[index].sample_values.slice(0,10);
    var otu_labels = data.samples[index].otu_labels.slice(0,10);

    console.log(otu_ids)

    // Create a trace
    var trace = {
        x: sample_values,
        y: otu_ids,
        type: "bar",
        text: otu_labels,
        orientation: 'h',
        marker: {
            width: 2
        },
    };

    var data = [trace];

    var layout = {
        width: 500,
        height: 500,
        title: "10 OTU samples",
        xaxis: {title: "Sample Values"},
        yaxis: {autorange: "reversed"}
    };

    Plotly.newPlot("bar", data, layout);
}

// ----------------------------------------------------
// BUILD Bubble graph fo OTU samples
//-----------------------------------------------------
function plotBubbleGraph(data, index) {
    var otu_ids = data.samples[index].otu_ids;
    var sample_values = data.samples[index].sample_values;
    var otu_labels = data.samples[index].otu_labels;

    var trace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            color: otu_ids,
            size: sample_values
        }
    };

    var data = [trace];

    var layout = {
        title: 'OTU Samples',
        showlegend: false,
        height: 500,
        width: 1000
    };

    Plotly.newPlot('bubble', data, layout);
}

//--------------------------------------------------
// Build Gauge graph for wash frequency number wfreq
//---------------------------------------------------
function plotGaugeGraph(data, index) {
    var scrubs_per_week = data.metadata[index].wfreq;
    
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: scrubs_per_week,
            title: { text: "Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkgreen" },
                bar: { color: "green" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                  { range: [0, 1], color: "rgba(232, 226, 202, .5)"},
                  { range: [1, 2], color: "rgba(210, 206, 145, .5)" },
                  { range: [2, 3], color: "rgba(202, 209, 95, .5)" },
                  { range: [3, 4], color: "rgba(170, 202, 42, .5)" },
                  { range: [4, 5], color: "rgba(110, 154, 22, .5)" },
                  { range: [5, 6], color: "rgba(90, 150, 15, .5)" },
                  { range: [6, 7], color: "rgba(50, 127, 10, .5)" },
                  { range: [7, 8], color: "rgba(14, 127, 5, .5)" },
                  { range: [8, 9], color: "rgba(5, 100, 0, .5" }
                ]
            }
        }
    ];

    var layout = {width: 600, height: 500, margin: {t:0, b:0}};

    Plotly.newPlot('gauge', data, layout);
}


