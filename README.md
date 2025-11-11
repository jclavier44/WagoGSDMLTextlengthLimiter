# WagoGSDMLTextlengthLimiter
Wago GSD file reducer for S7-1200 memory compatibility

The node.js script "ProcessGSDML.js" will reduce the info and diag texts to 20 characters from the primary language (englich) and delete other language (german)

1) Install node.js (tested with v20)
2) Install xml2js with npm
3) Place the file ProcessGSDML.js in a new folder, for exampe "ProcessGSD"
4) Create 2 subfolders: "ProcessGSD/input" and "ProcessGSD/output"
5) Go to downloadcenter.wago.com; create an customer account for free; Look for "GSD file for PROFINET"; Download the GSD archive
6) Extract the archive in a folder, for example "WagoGSD"
7) Copy and past the file "GSDML-V2.xx-wago-series750_753-202xxxxx.xml" in the previously created subfolder "ProcessGSD/input"
8) Run a command in the folder ProcessGSD:  "node ./ProcessGSDML.js"
9) Copy the generated .xml file from "ProcessGSD/output" and replace the original one in folder WagoGSD
10) Import the GSD in TIA Portal (tested with V16)
