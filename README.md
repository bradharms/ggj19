# GGJ 2019 Project

## Synopsis

Tower defense in first-person 3D, possibly VR if enough time

## Running / Installing

- Install [Node.js](nodejs.org)
- Clone the project
- Open command prompt
- CD to project directorty
- Run `npm install`
- Run `npm start`
- Open web browser to http://localhost:8080

## TODO (order of priority):

- *Wall* - Enemies run into it, has health. One hit by trojan will kill. (indicated by color?)


- *Sector divisions in play field*










- *Multiple players*


## DONE

- *Map* - Center area / tower
- *Player* - Camera + controls via mouse. Health.
- *Turret* - Shoots at enemies in range. Number of avail. turrents = num. enemies defeated / 3(?)
- *Trojan* - Runs in straight line towards center and destroys what it hits, and itself upon attack
- *Health for turrets* - Don't just fly away immediately
- *Destroy trojans on impact with turrets*
- *Health for trojans* - Trojens take damage instead of flying away
- *Show score counter*
- *Point system* - Get points for turrets destroying trojans
    - 200 for trojan
- *Cost to play turrets* - Use 600 points to place turret
- *End game condition* If trojan hits base and score = 0, game over
    - Spending points to 0 does NOT kill you
