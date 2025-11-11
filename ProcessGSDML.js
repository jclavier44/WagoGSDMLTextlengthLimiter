const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Function to limit text length
function limitTextLength(text, maxLength = 20) {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Take first 18 characters and append ".." to make 20 characters total
  return text.substring(0, maxLength - 2) + "..";
}

// Function to process a single XML file
function processXmlFile(inputFileName) {
  const inputPath = path.join('./input', inputFileName);
  const outputPath = path.join('./output', inputFileName);
  
  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    return;
  }
  
  // Read the XML file
  const xmlContent = fs.readFileSync(inputPath, 'utf8');
  
  // Parse XML
  xml2js.parseString(xmlContent, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error('Error parsing XML:', err);
      return;
    }

    // Process all Text elements in PrimaryLanguage
    const primaryLanguage = result.ISO15745Profile.ProfileBody.ApplicationProcess.ExternalTextList.PrimaryLanguage;
    
    if (primaryLanguage && primaryLanguage.Text) {
      const textElements = Array.isArray(primaryLanguage.Text) ? primaryLanguage.Text : [primaryLanguage.Text];
      
      textElements.forEach(textElement => {
        if (!String(textElement.$.TextId).includes('IDT_NAME') && textElement.$.Value) {
          const originalValue = textElement.$.Value;
          textElement.$.Value = limitTextLength(originalValue);
          console.log(`Modified: "${originalValue}" -> "${textElement.$.Value}"`);
        }
      });
    }
    //Delete other language
    const OtherLanguage = result.ISO15745Profile.ProfileBody.ApplicationProcess.ExternalTextList.Language;
    if (OtherLanguage){
      delete result.ISO15745Profile.ProfileBody.ApplicationProcess.ExternalTextList.Language;
    } 

    // Convert back to XML
    const builder = new xml2js.Builder();
    const modifiedXml = builder.buildObject(result);

    // Ensure output directory exists
    if (!fs.existsSync('./output')) {
      fs.mkdirSync('./output', { recursive: true });
    }
    
    // Write the modified XML to output folder
    fs.writeFileSync(outputPath, modifiedXml);
    console.log(`Modified XML saved to: ${outputPath}`);
  });
}

// Main execution
function main() {
  // Check if input directory exists
  if (!fs.existsSync('./input')) {
    console.error('Input directory "./input" not found!');
    return;
  }
  
  // Get all XML files from input directory
  const files = fs.readdirSync('./input');
  const xmlFiles = files.filter(file => file.toLowerCase().endsWith('.xml'));
  
  if (xmlFiles.length === 0) {
    console.log('No XML files found in ./input directory');
    return;
  }
  
  console.log(`Found ${xmlFiles.length} XML file(s) to process:`);
  xmlFiles.forEach(file => console.log(`  - ${file}`));
  
  // Process each XML file
  xmlFiles.forEach(processXmlFile);
}

// Run the script
main();