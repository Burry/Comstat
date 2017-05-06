
![Logo](public/images/android-chrome-192x192.png)

Comstat
-------
Comcast forces you to go through a pretty crappy login process until they finally show you your data usage on a simple progress bar. This project uses Eric Swanson's [Python script](https://github.com/lachesis/comcast) to fetch the information from Comcast and then presents it in a nice front-end which...
  - You can host and share with your family or roommates
  - Requires you to authenticate exactly once
  - Can be easily expanded upon in the future with statistics and use predictions to make something much more useful than what Comcast provides

Preview
-------
![Screenshot](Screenshot.png?raw=true)

Installation
-------
Requires Node.js and Python 3 with the requests library.
1. [Download](https://github.com/Burry/Comstat/archive/master.zip) the repo or run `git clone https://github.com/Burry/Comstat.git`
2. Inside the Comstat directory, run `npm install` to install node dependencies.

Usage
-------
Enter the Comstat directory and start the server with `npm start`

You should then be able to access Comstat through http://localhost:3234.


License
-------
MIT © [Grant Burry](https://grantburry.com)
