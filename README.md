# National Parks Explorer

This is my phase 1 project for the Software Engineering course at Flatiron School. It's a single page application that makes calls to the open datasets from National Parks website: https://www.nps.gov/subjects/developer/api-documentation.htm

# Installation

In order for this page to run properly, I use NPM to run a mock server with the db.json file:

https://www.npmjs.com/package/json-server

Once the NPM package is installed, the local db.json is initialized with the following command in the terminal:

# json-server --watch db.json

THis will then allow POST and DELETE requests for campsites and parks that you save to a favorites list. 

# API Key

The API Key is hidden with gitignore, and is not exposed to GitHub. 



