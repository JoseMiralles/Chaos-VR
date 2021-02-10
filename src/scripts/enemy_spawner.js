import EnemyRobot from "./enemy_robot";

export default class EnemySpawner {

    constructor(enemyGroup, robotAsset, smallEnemyLimit){
        this.enemyGroup = enemyGroup;
        this.robotAsset = robotAsset;
        this.smallEnemyCounter = { limit: smallEnemyLimit, count: 0 };
        this.startSpawner();
    }

    startSpawner(){
        setInterval(() => {

            const smallEnemyEmptySpots = this.smallEnemyCounter.limit - this.smallEnemyCounter.count;

            if ( smallEnemyEmptySpots > 0 ){
                for ( let i = 0; i <= smallEnemyEmptySpots - 1; i++ ){
                    const bot = new EnemyRobot( this.robotAsset.clone() );
                    this.smallEnemyCounter.count ++;
                    bot.onDeath = () => { this.smallEnemyCounter.count -- };
                    this.enemyGroup.add( bot );
                }
            }

        }, 2000);
    }

}