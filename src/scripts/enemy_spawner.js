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
        this.smallEnemyCounter = { limit: 1, count: 0 };
        this.startSpawner();
    }

    startSpawner(){
        setInterval(() => {

            // Add small robots as required.
            const smallEnemyEmptySpots = this.smallEnemyCounter.limit - this.smallEnemyCounter.count;
            if ( smallEnemyEmptySpots > 0 ){
                for ( let i = 0; i <= smallEnemyEmptySpots - 1; i++ ){
                    const bot = new EnemyRobot
                        ( this.assetStore.robot1.clone(), this.projectileGroup, this.assetStore );
                    this.smallEnemyCounter.count ++;
                    bot.onDeath = () => {
                        this.smallEnemyCounter.count --;
                        this.killCount++;
                        this.adjustSpawnRate();
                    }
                    this.enemyGroup.add( bot );
                }
            }

        }, 2000);
    }

    // Spawnrate is adjusted based on kill count.
    adjustSpawnRate(){
        if (this.smallEnemyCounter.limit <= 10) // Allow for now more than 7 enemies top.
            this.smallEnemyCounter.limit = Math.ceil(this.killCount / 10);
    }

}