Comstat
-------
Comcast forces you to go through a pretty crappy login process until they finally show you your data usage on a simple progress bar. This project uses Eric Swanson's [Python script](https://github.com/lachesis/comcast) to fetch the information from Comcast and then presents it in a nice front-end which...

  - You can host and share with your family or roommates
  - Doesn't require a login process, just set the config file
  - Can be easily expanded upon in the future with statistics and use predictions to make something much more useful than what Comcast provides

Preview
-------
![Screenshot](Screenshot.png?raw=true)

Installation
-------
Requires Node.js and Python 3 with the requests library.
1. [Download](https://github.com/Burry/Comstat/archive/master.zip) the repo or run `git clone https://github.com/Burry/Comstat.git`
2. Rename config.example.json to config.json, and fill in the details as descibed below.
3. Run `npm install -g` to install node dependencies.

Usage
-------
Enter the Comstat directory and start the server with `npm start`

You should then be able to access Comstat through http://localhost:3234 or at whatever port you specified. To share this site with others who should keep an eye on your network's data usage, just proxy the server through nginx.

Config Values
-------
- `port` (Optional) Port to run the server on
    - default: 3234
- `interface` (Optional) Routing interface
    - Set to 0.0.0.0 to access from other machines
    - default: localhost
- `comcastUsername` Your Comcast username
- `comcastPassword` Your Comcast password
- `title` (Optional) Set a custom app title
    - default: Comstat
- `icon` (Optional) Specify the class name of a [FontAwesome icon](http://fontawesome.io/icons/) to replace the default logo
    - (e.g. `fa-bar-chart`)

License
-------
MIT © [Grant Burry](https://grantburry.com)
