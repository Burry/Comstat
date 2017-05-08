
![Logo](public/images/android-chrome-192x192.png)

Comstat
-------
Comcast forces you to go through a pretty crappy login process until they finally show you your data usage on a simple progress bar. This project uses Eric Swanson's [Python script](https://github.com/lachesis/comcast) to fetch the information from Comcast and then presents it in a front-end for you.

Features
-------
- Log in only once
- Auto-loads usage data in background so you don't have to wait to check it
- Tracks usage for the month to display a nice graph
- Slick, mobile-friendly UI
- Ideal for proxying through something like nginx and hosting for your family/roommates
- Planned: add detailed statistics and use predictions

Preview
-------
![Screenshot](Screenshot.png?raw=true)

Installation
-------
Requires Node.js and Python 3 with the requests library.
1. [Download](https://github.com/Burry/Comstat/archive/master.zip) the repo or run `git clone https://github.com/Burry/Comstat.git`
2. Inside the Comstat directory, run `sudo npm install` to install node dependencies.
3. Create the database directory in your root folder with `sudo mkdir -p /data/db && sudo chown -R $USER /data/db`. If you'd like, you can use a different directory, but then you must ensure that Mongo has permissions to it, and you must update the path in the pre- and post- start scripts in package.json.

Usage
-------
Enter the Comstat directory and start the server with `npm start`

You should then be able to access Comstat at [http://localhost:3234]().


License
-------
MIT © [Grant Burry](https://grantburry.com)
