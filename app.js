const fs = require('fs');
const parsertf = require('rtf-parser');

let filename = './Summons MattTest.rtf';

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
    
    
    //for(let i = 0; i < rtfline.length; i++) {
    //  let chkOne = '';
    //  let chkTwo  = '';
    //  
    //  if (i === 0) {
    //    // On first line, set chkOne value.
    //    chkOne = rtfline[i];
    //  } else {
    //    // On subsequent lines, set chkTwo to current value.
    //    // Use chkOne to compare chkTwo against.
    //    chkTwo = rtfline[i];
    //    
    //    if (!chkTwo === 'R1X' || chkTwo === 'REM2' || chkTwo === 'XXFLAT') {
    //      newArray.push(chkOne);
    //    }
    //    
    //    // Set chkOne to current value, ready for next iteration.
    //    chkOne = rtfline[i];
    //  }
    //}
    
    
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
    
    // Remove preceeding newline characters.
    let firstLine = outputfile.slice(0, 1).toString();
    let processedFirstLine = '';
    let subst = '';
    
    if (firstLine.match(/R1X/)) {
      processedFirstLine = firstLine.replace(/^\s*\n/g, subst);
    } else if (firstLine.match(/REM2/)) {
       processedFirstLine = firstLine.replace(/^\s*\n/g, subst);
    } else if (firstLine.match(/Council Logo and Information/)) {
      let pattern = /Council Logo and Information\,\n/gm;
      processedFirstLine = firstLine.replace(pattern, subst); // REMOVE FIRST LINE OF SUMMONS. https://regex101.com/ Council Logo and Information[,]\n
    }
    console.log(processedFirstLine);
    outputfile.splice(0, 1, processedFirstLine);
    
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
