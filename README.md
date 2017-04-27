Comstat
-------
![Screenshot](Screenshot.png?raw=true)
Requires Node.js and Python 3 with the requests library. Powered by Eric Swanson's [python script](comcast).

Usage
-------
1. [Download](https://github.com/Burry/Comstat/archive/master.zip) the repo or run `git clone https://github.com/Burry/Comstat.git`
2. Rename config.example.json to config.json, and fill in your Comcast username and password. You can also set a custom port or change the interface.
3. Run `npm install` to install node dependencies.
4. Enter the Comstat directory and start the server with `node app.js`

You should then be able to access Comstat through http://localhost:3234 or at whatever port you specified. To share this site with others who should keep an eye on your network's data usage, just proxy the server through nginx.
