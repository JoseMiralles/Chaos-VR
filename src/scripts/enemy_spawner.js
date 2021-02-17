import * as THREE from "three";

import EnemyRobot from "./enemy_robot";
import EnemyRobotMedium from "./enemy_robot_medium";
import projectileGroup from "./projectile_group";

export default class EnemySpawner {

    constructor(assetStore){

        // Group in which enemies are spawned.
        this.enemyGroup = new THREE.Group();
        this.enemyGroup.position.z = -10;
        // Group in which enemy projectiles are spawned.
        this.projectileGroup = new projectileGroup( 200 );

        this.killCount = 0;
        this.assetStore = assetStore;

        this.setupHandlers();
        this.initializeSpawners();
    }

    killAll(){
        this.setupHandlers();
        this.enemyGroup.children.forEach( bot => {
            bot.applyDamage(10000);
        });
    }

    setupHandlers(){
        this.smallEnemyHandler = new EnemyHandler(
            EnemyRobot, 10, this.assetStore,
            this.projectileGroup, this.assetStore.robot1,
            this.enemyGroup,
            10, // Amount of kills, of this enemy tye are needed to begin spawning one more bot of this type.
            7   // The total number of bots of this kind that can be alive at the same time.
            );
        this.mediumEnemyHandler = new EnemyHandler(
            EnemyRobotMedium, 5, this.assetStore,
            this.projectileGroup, this.assetStore.robot2,
            this.enemyGroup,
            20, // Amount of kills, of this enemy tye are needed to begin spawning one more bot of this type.
            3   // The total number of bots of this kind that can be alive at the same time.
            );
    }

    initializeSpawners(){
        setInterval(() => {

            // Add small robots as required.
            const smallEnemyEmptySpots = this.smallEnemyHandler.getNumberOfEmptySpots();
            if ( smallEnemyEmptySpots >= 1 ){
                for ( let i = 1; i <= smallEnemyEmptySpots; i++ ){
                    this.smallEnemyHandler.spawnBot();
                }
            }

            if (!this.mediumEnemyHandler.isSpawning && this.smallEnemyHandler.killCount > 10)
                this.mediumEnemyHandler.startSpawning();
            const mediumEnemyEmptySpots = this.mediumEnemyHandler.getNumberOfEmptySpots();
            if ( mediumEnemyEmptySpots >= 1 ){
                for ( let i = 1; i <= mediumEnemyEmptySpots; i++ ){
                    this.mediumEnemyHandler.spawnBot();
                }
            }

        }, 1000);
    }

}

class EnemyHandler {

    constructor( enemyClass, numberOfBots, assetStore, projectileGroup, model, enemyGroup, spawnDivider, limit ){
        this.totalSpots = 0;
        this.usedSpots = 0;

        this.isSpawning = false;

        this.pos = 0;
        this.array = new Array(numberOfBots + 1);
        this.killCount = 0;

        this.spawnDivider = spawnDivider;
        this.limit = limit;

        this.populateArray( enemyClass, model, projectileGroup, assetStore, enemyGroup, spawnDivider, limit );
    }

    adjustSpawnRate(){
        if (this.totalSpots <= this.limit){
            this.totalSpots = Math.ceil( this.killCount / this.spawnDivider );
            if (this.totalSpots > this.limit) this.totalSpots = this.limit;
        }
    }

    startSpawning(){
        this.isSpawning = true;
        this.totalSpots = 1;
    }

    getNumberOfEmptySpots(){
        return this.totalSpots - this.usedSpots;
    }

    spawnBot(){
        if (this.array[this.pos].free){
            this.array[ this.pos ].spawn();
            this.usedSpots ++;
        }
        this.pos ++;
        if ( this.pos >= this.array.length ) this.pos = 0;
        window.arr = this.array;
    }

    populateArray( enemyClass, model, projectileGroup, assetStore, enemyGroup ){
        for (let i = 0; i < this.array.length; i++) {
            this.array[i] = new enemyClass(
                model.clone(), projectileGroup, assetStore, i
            );
            this.array[i].onDeath = () => {
                this.usedSpots --;
                this.killCount ++;
                this.adjustSpawnRate();
            }
            enemyGroup.add( this.array[i] );
        }
    }

}