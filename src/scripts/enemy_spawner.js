import * as THREE from "three";

import EnemyRobot from "./enemy_robot";

export default class EnemySpawner {

    constructor(assetStore){

        // Group in which enemies are spawned.
        this.enemyGroup = new THREE.Group();
        this.enemyGroup.position.z = -10;
        // Group in which enemy projectiles are spawned.
        this.projectileGroup = new THREE.Group();

        this.killCount = 0;
        this.assetStore = assetStore;

        this.setupHandlers();
        this.startSpawner();
    }

    setupHandlers(){
        this.smallEnemyHandler = new EnemyHandler(
            EnemyRobot, 10, this.assetStore,
            this.projectileGroup, this.assetStore.robot1,
            this.enemyGroup
            );
        this.smallEnemyHandler.startSpawning();
    }

    startSpawner(){
        setInterval(() => {

            // Add small robots as required.
            const smallEnemyEmptySpots = this.smallEnemyHandler.getNumberOfEmptySpots();
            if ( smallEnemyEmptySpots >= 1 ){
                for ( let i = 1; i <= smallEnemyEmptySpots; i++ ){
                    this.smallEnemyHandler.spawnBot();
                }
            }

        }, 1000);
    }

}

class EnemyHandler {

    constructor( enemyClass, numberOfBots, assetStore, projectileGroup, model, enemyGroup ){
        this.totalSpots = 0;
        this.usedSpots = 0;

        this.pos = 0;
        this.array = new Array(numberOfBots + 1);
        this.killCount = 0;

        this.populateArray( enemyClass, model, projectileGroup, assetStore, enemyGroup );
    }

    adjustSpawnRate(){
        if (this.totalSpots <= 10){
            this.totalSpots = Math.ceil( this.killCount / 10 );
            if (this.totalSpots > 10) this.totalSpots = 10;
        }
    }

    startSpawning(){
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