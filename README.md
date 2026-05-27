# PRRI-AR2026

An augmented reality escape game developed by students and the [Artificial Intelligence Laboratory](https://ai.foi.hr/) at the [University of Zagreb Faculty of Organization and Informatics](https://www.foi.unizg.hr/). The game is developed using [AR.js](https://github.com/AR-js-org/AR.js/). More details available at [itch.io](https://ailab-foi.itch.io/prri-ar2026).

# Short intro

To generate patterns you can use [this online tool](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html). To generate markers you can use [this online tool](https://carnaux.github.io/NFT-Marker-Creator/). To generate your own SSH keys, use the `generate-keys.sh` script.

## Starting the database and server

runzeo -a 0.0.0.0:5334 -f /tmp/data.fs &
python3 server.py

## Delete the database (if needed) 

pkill runzeo
rm /tmp/data.fs /tmp/data.fs.index /tmp/data.fs.lock /tmp/data.fs.tmp 2>/dev/null

## Game progress

To track game progress, go to: https://[ip_adress]:5333/progress.html
Login data - Username: admin    Password: admin

## GDD

Read our game design document here: https://github.com/AILab-FOI/PRRI-AR2026/wiki/Game-design-document%E2%80%90GDD

## Itch.io

Read more about our videogame on this link: https://ailab-foi.itch.io/prri-ar2026

## Credits

A previous version of this game has been developed [here](https://github.com/AILab-FOI/PRRI-AR2024).
