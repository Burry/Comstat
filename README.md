<p align="center">
  <img src="public/images/apple-touch-icon.png?raw=true" alt="Logo" />
</p>

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
<p align="center">
  <img src="Screenshot.png?raw=true" alt="Screenshot" />
</p>

Installation
-------
Requires [Node.js](https://nodejs.org/en/download/), [MongoDB 3.2](https://docs.mongodb.com/manual/installation/) or later, and [Python 3](https://www.python.org/downloads/) with the [requests](http://docs.python-requests.org/en/master/user/install/) library. Follow those links to install them if you haven't already.

1. [Download](https://github.com/Burry/Comstat/archive/master.zip) the repo or run `git clone https://github.com/Burry/Comstat.git`
2. Create the database directory in your root folder with `sudo mkdir -p /data/db && sudo chown -R $USER /data/db`
3. Inside the Comstat directory, run `sudo npm install` to install node dependencies.

If you'd like, you can use a different database directory, but then you must ensure that Mongo has permissions to it, and you must update the path in the pre- and post- start scripts in package.json, unless you wish to start Mongo separately from Comstat.

Usage
-------
Enter the Comstat directory, and start the node server and database together with `npm start`

If you'd like to start them separately (i.e. you already use Mongo for something else), Comstat can be started with `node app.js` and MongoDB with `mongod`

You should then be able to access Comstat at [http://localhost:3234](http://localhost:3234).


License
-------
MIT © [Grant Burry](https://grantburry.com)
