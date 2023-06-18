# Below should be plcaed in the startup folder by doing: 
# WIN+R
# shell:startup
# Create .sh file and place the following in there. 

# Replace below with the proper file path
cd ~/OneDrive/Documents/Projects/membership-app/frontend
npm run preview &
cd ../api
node index.js  &
start http://localhost:4173
disown