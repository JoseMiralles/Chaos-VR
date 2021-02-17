import EnemyRobot from "./enemy_robot";

export default class EnemyRobotMedium extends EnemyRobot {

    constructor(model, projectileGroup, assetStore){
        super(model, projectileGroup, assetStore);
        this._initialHealth = 200;
        this._highSpeed = 0.3;
        this._lowSpeed = 0.1;
        this._projectileVelocity = 7;
    }

}