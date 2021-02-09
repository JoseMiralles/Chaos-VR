import EnemyRobot from "./enemy_robot";

export default class EnemySpawner {

    constructor(room, robotAsset, limit){
        this.room = room;
        this.robotAsset = robotAsset;
        this.limit = limit;
        this.startSpawner();
    }

    startSpawner(){
        setInterval(() => {

            const difference = this.limit - this.room.children.length;

            if ( difference > 0 ){
                for ( let i = 0; i <= difference - 1; i++ ){
                    this.room.add(
                        new EnemyRobot( this.robotAsset.clone() )
                    );
                }
            }

        }, 2000);
    }

    setLimit(newLimit){
        this.limit = newLimit;
    }
}