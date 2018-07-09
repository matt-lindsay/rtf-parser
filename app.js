const fs = require('fs');
const parsertf = require('rtf-parser');

let filename = './Rem1 MattTest.rtf';

// New instance of rtf-parser module.
parsertf.stream(fs.createReadStream(filename), (err, doc) => {
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
    
    // New array with empty first lines removed.
    //let newArray = [];
    
    // Clear blank first lines.
    if (filename.match(/Rem1/)) {
      rtfline.splice(0, 2);
    } else if (filename.match((/Rem2/) || filename.match(/Summons/))) {
      rtfline.splice(0,1);
    }

    //console.log('>>> Number of lines in the RTF file: ' + rtfline.length); // DEBUG
    //console.log(rtfline); // DEBUG
    
    // Create an empty output array for reformatted data.
    let outputfile = [];
    // Loop through each item in the rtfline array to create a CSV.
    rtfline.forEach(item => {
      // Identify the start of each type of record...
      if (item === 'R1X' || item === 'REM2' || item === 'XXFLAT') {
        // ...add a newline prior to the start of a new record. The first record will require its
        // preceeding newline character to be removed.
        outputfile.push('\n' + item);
      } else {
        // ...add each subsequent item to the CSV.
        outputfile.push(item);
      }
    });
    
    // Remove unnecessary preceeding newline characters.
    let firstLine = outputfile.slice(0, 1).toString(); // Extract the first line of the data array.
    let processedFirstLine = '';
    let substitute = '';
    
    // Match te record type and remove the comma and newline characters.
    if (firstLine.match(/R1X/)) {
      processedFirstLine = firstLine.replace(/^\s*\n/g, substitute);
    } else if (firstLine.match(/REM2/)) {
      processedFirstLine = firstLine.replace(/^\s*\n/g, substitute);
    } else if (firstLine.match(/XXFLAT/)) {
      processedFirstLine = firstLine.replace(/^\s*\n/g, substitute); // REMOVE FIRST LINE OF SUMMONS. https://regex101.com/
    }
    console.log(processedFirstLine); // DEBUG
    // Insert newly processed first line record back into the data array.
    outputfile.splice(0, 1, processedFirstLine);
    
    // Equalising record lengths: ensure that each record is 21 fields long.
    // If field 11 is blank, remove it.
    let normalisedOutputFile = [];
    let i = 0;
    outputfile.forEach(item => {
      if (item.match(/R1X/)) {
        i = 1;
        normalisedOutputFile.push(item);
      } else {
        if (i === 11) {
          if (!item.match(/^\s*\n/g)) {
            // Ignore it.
          } else {
            normalisedOutputFile.push(item);
          }
        }
        normalisedOutputFile.push(item);
        i++;
      }
    });

    // Write the compiled CSV data in outputfile to a file.
    fs.writeFile('./processedRtf.csv', normalisedOutputFile, 'utf8', (err) => {
      if (err) {
        throw err;
      } else {
        console.log('>>> File written.');  // DEBUG
      }
    });
  }
});
