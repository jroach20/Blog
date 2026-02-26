What is this?
It's a fan project for the anime Panty and Stocking. I tried to make a personal diary app based on a blog that appears in one episode, using assests from the show to make it a 1:1 replica (as best as I could).

Summary of the code:
The main html makes an api call to the backend.js which then calls functions from pgClient.js which fetches the data from the postgres database and displays it on the main page.

Requirements:
Node@22.19.0
express@5.2.1
multer@2.0.2
pg@8.17.2

To run (in this order):
node backend.js
open main.html
