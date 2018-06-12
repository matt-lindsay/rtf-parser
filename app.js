const fs = require('fs');
const parsertf = require('rtf-parser');

// New instance of rtf-parser module.
parsertf.stream(fs.createReadStream('./rtfTest.rtf'), (err, doc) => {
  if (err) {
    throw err;
  } else {
    
    // Array to hold each part of the textual data.
    let rtfline = []; 
    // Empty line item to write to prior to writing to the rtfline array.
    let lineitem = '';
    
    // Loop through the parsed rtf document...
    doc.content.forEach(item => {
      item.content.forEach(record => {
        lineitem += record.value;
      });
      // ...writing each line back to the rtfline array.
      rtfline.push(lineitem);
      // Then clear the lineitem variable before the next loop iteration.
      lineitem = '';
    });
    
    //console.log('>>> Number of lines in the RTF file: ' + rtfline.length); // DEBUG
    //console.log(rtfline); // DEBUG
    
    // Create an empty output array for reformatted data.
    let outputfile = [];
    // Loop through each item in the rtfline array to create a CSV.
    rtfline.forEach(item => {
      // Identify the start of each type of record...
      if (item === 'R1X' || item === 'REM2' || item === 'XXFLAT') {
        // ...add a newline prior to the start of a new record.
        outputfile.push('\n' + item);
      } else {
        // ...add each subsequent item to the CSV.
        outputfile.push(item);
      }
    });
    
    // Write the compiled CSV data in outputfile to a file.
    fs.writeFile('./processedRtf.csv', outputfile, 'utf8', (err) => {
      if (err) {
        throw err;
      } else {
        console.log('>>> File written.');  // DEBUG
      }
    });
  }
});
