### Leading up to event

Step 1. Export mobile app APK
Step 2. Create account on https://www.diawi.com/
Step 3. Upload APK to https://www.diawi.com/
Step 4. Install APK on ticket scanners mobile (APK will only be available for 24 hours)

### On the day

Step 1. Download purchases.json from mongoDB compass on friday morning
Step 2. Add purchases.json in barhpoffline folder
Step 3. Run npm start
Step 4. Get your laptop's IP address
Step 5. Input your IP address into the mobile app
Step 6. Start scanning

### In case of server crash

Step 1. Make sure purchases.json isn't empty

# If empty

Step 1. Go into backup folders and look for the file with the highest number
Step 2. Copy the file with the highest number into the root directory (make sure to change the name back to just purchases.json)
Step 3. Type crtl + c in terminal to stop the server
Step 4. Restart server with npm start

# If not empty

Step 1. Type crtl + c in terminal to stop the server
Step 2. Restart server with npm start
