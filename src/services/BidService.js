'use strict';

const fs = require('fs');
const parsertf = require('rtf-parser');

var BidService = function() {
        let processRtf = function(filename, cb)  {
          parsertf.stream(fs.createReadStream(filename), (err, doc) => {
            if (err) {
              cb(err, null);
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

              // Create an empty output array for reformatted data.
              let outputfile = [];
              // Couter for identifying the first record in the data.
              let counter = 0;
              // Boolean to test for reminder (true) or summons (false).
              let reminder = true;
              // Loop through each item in the rtfline array to create a CSV.
              rtfline.forEach(item => {
                // Identify the start of each type of record...
                if (item === 'BIDREMF' || item === 'BIDSUM') {
                  // ...add a newline prior to the start of a new record. The first record will require its
                  // preceeding newline character to be removed.
                  // Set reminder boolean value.
                  if (item === 'BIDSUM') {
                    reminder = false;
                  }
                  if (counter === 0) {
                    // If it is the first record, add to the output array.
                    outputfile.push(item);
                  } else {
                    // If it is the start of a new record, preceed it with a line feed.
                    outputfile.push('\n' + item); // '\n' +
                  }
                } else {
                  // ...add each subsequent item to the CSV.
                  outputfile.push(item);
                }
                // Increment the counter by 1.
                counter++;
              });

              // Equalising record lengths: ensure that each record has the same number of fields.
              // If field 11 is blank, remove it as this is an additional address line where 6 or more
              // address fields occur.
              let normalisedOutputFile = [];
              let i = 0; // Zero based record position counter to identify the 11th record.
              outputfile.forEach(item => {
                // Remove any ',' characters from each item.
                // Then repeat incase there is more than one ',' per string item.
                item = item.replace(',', ' ');
                item = item.replace(',', ' ');
                // Split summons court cost figures into two fields.
                item = item.replace('Cost (Authority)', ',Cost (Authority)');

                if (item.match(/BIDREMF/) || item.match(/BIDSUM/)) {
                  normalisedOutputFile.push(item);
                  i = 0; // Reset the counter when a new record is identified.
                } else {
                  if (i === 10 && reminder === true) {
                    if (item.length === 0) {
                      // Ignore it.
                      console.log('>>> IGNORED ' + item);
                    } else {
                      normalisedOutputFile.push(item);
                    }
                  } else if (i === 16 && reminder === true) { // Make space for records with a second financial year.
                    if (item === 'amounts') {
                      normalisedOutputFile.push('');
                      normalisedOutputFile.push(item);
                    } else {
                      normalisedOutputFile.push(item);
                    }
                  } else if (i === 9 && reminder === false) { // Make space for records with an extra address field.
                    if (item.includes('day')) {
                      normalisedOutputFile.push('');
                      normalisedOutputFile.push(item);
                    } else {
                      //normalisedOutputFile.push('');
                      normalisedOutputFile.push(item);
                    }
                  } else {
                    normalisedOutputFile.push(item);
                  }
                }
                //}
                i++;
              });

              // Write the compiled CSV data in outputfile to a file.
              fs.writeFile(filename + '.csv', normalisedOutputFile, 'utf8',
                (err) => {
                if (err) {
                  cb(err, null);
                  //throw err;
                } else {
                  cb(null, '>>> File written.');
                  //console.log('>>> File written.');  // DEBUG
                }
              });
            }
          });
        };

        return {
          processRtf: processRtf
        };
      };
module.exports = BidService;
