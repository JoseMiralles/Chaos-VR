import * as THREE from "three";

import EnemyRobot from "./enemy_robot";

export default class EnemySpawner {

    constructor(robotAsset, smallEnemyLimit){
        
        // Group in which enemies are spawned.
        this.enemyGroup = new THREE.Group();
        this.enemyGroup.position.z = -10;
        // Group in which enemy projectiles are spawned.
        this.projectileGroup = new THREE.Group();

        this.robotAsset = robotAsset;
        this.smallEnemyCounter = { limit: smallEnemyLimit, count: 0 };
        this.startSpawner();
    }

    startSpawner(){
        setInterval(() => {

            // Add small robots as required.
            const smallEnemyEmptySpots = this.smallEnemyCounter.limit - this.smallEnemyCounter.count;
            if ( smallEnemyEmptySpots > 0 ){
                for ( let i = 0; i <= smallEnemyEmptySpots - 1; i++ ){
                    const bot = new EnemyRobot
                        ( this.robotAsset.clone(), this.projectileGroup );
                    this.smallEnemyCounter.count ++;
                    bot.onDeath = () => { this.smallEnemyCounter.count -- };
                    this.enemyGroup.add( bot );
                }
            }

        }, 2000);
    }

}