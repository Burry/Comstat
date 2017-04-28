Comstat
-------
![Screenshot](Screenshot.png?raw=true)
Comcast forces you to go through a pretty crappy login process until they finally show you your data usage on a simple progress bar. This project uses Eric Swanson's [Python script](https://github.com/lachesis/comcast) to fetch the information from Comcast, and Comstat uses it to present a nice front end for your data usage that:
  - You can host and share with your family or roommates
  - Doesn't require a login process, just set the config file
  - Can be easily expanded upon in the future with statistics and use predictions to make something much more useful than what Comcast provides

Usage
-------
Requires Node.js and Python 3 with the requests library.
1. [Download](https://github.com/Burry/Comstat/archive/master.zip) the repo or run `git clone https://github.com/Burry/Comstat.git`
2. Rename config.example.json to config.json, and fill in the details as descibed below.
3. Run `npm install` to install node dependencies.
4. Enter the Comstat directory and start the server with `node app.js`

You should then be able to access Comstat through http://localhost:3234 or at whatever port you specified. To share this site with others who should keep an eye on your network's data usage, just proxy the server through nginx.

Config Options
-------
- `port` (Optional) Port to run the server on
- `interface` (Optional) Routing interface – default 0.0.0.0
- `comcastUsername` Your Comcast username
- `comcastPassword` Your Comcast password
- `customTitle` (Optional) Set a custom app title other than "Comstat"
- `customIcon` (Optional) Specify the class name of a [FontAwesome icon](http://fontawesome.io/icons/) to replace the default logo
