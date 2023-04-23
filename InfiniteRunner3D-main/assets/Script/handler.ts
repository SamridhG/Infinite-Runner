import { CapsuleCollider, ITriggerEvent } from "cc";
import {
  _decorator,
  Camera,
  Component,
  game,
  Mat4,
  MeshRenderer,
  Node,
  Rect,
  tween,
  UITransform,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("handler")
export class handler extends Component {
  @property({ type: Node })
  cone: Node = null;
  @property({ type: Node })
  plane: Node[] = [];
  @property({ type: Node })
  MainCamera: Node = null;
  @property({ type: Node })
  JumpButton: Node = null;
  @property({ type: Node })
  ObstacleParent: Node = null;
  firstTilePosition: Vec3 = null;
  lastTilePosition: Vec3 = null;
  PlayerPermanentPosition: Vec3 = null;
  demoObsticalPermanentPosition: Vec3 = null;
  obstaclerect: Rect = null;
  conerect: Rect = null;
  /**
   * object jump button
   * @description object jump-->jump button disable-->object return to permanent position-->jump button enable
   */
  onClickJumpButton() {
    let currentPosition = this.cone.getPosition();
    currentPosition.y += 2;
    this.JumpButton.active = false;
    tween(this.cone)
      .to(0.5, {
        position: currentPosition,
      })
      .call(() => {
        tween(this.cone)
          .to(0.5, {
            position: this.PlayerPermanentPosition,
          })
          .call(() => {
            this.JumpButton.active = true;
          })

          .start();
      })

      .start();
  }

  start() {
   // console.log("CONE WIDTH",this.cone.)
    this.PlayerPermanentPosition = this.cone.getPosition();
    this.firstTilePosition = this.plane[0].getPosition();
    this.demoObsticalPermanentPosition =
      this.ObstacleParent.children[
        this.ObstacleParent.children.length - 1
      ].getPosition();
    this.lastTilePosition = this.plane[this.plane.length - 1].getPosition();
    let collider = this.cone.getComponent(CapsuleCollider);
    console.log("Collider", collider);
    collider.on("onTriggerEnter", this.collide, this);
  }
  collide() {
    game.pause();
    console.log("INTERSECT");
  }
  /**
   * @description obstacle Movement
   */
  obstacleMovement() {
    for (let index = 0; index < this.ObstacleParent.children.length; index++) {
      let obstactlepos = this.ObstacleParent.children[index].getPosition();
      obstactlepos.z += 0.1;
      this.ObstacleParent.children[index].setPosition(obstactlepos);
      if (
        this.ObstacleParent.children[index].getPosition().z >=
        this.firstTilePosition.z
      ) {
        this.ObstacleParent.children[index].setPosition(
          this.demoObsticalPermanentPosition)
        
      }
    }
  }
 
  /**
   *
   * @description Movement of path
   */
  planeMovement() {
    for (let index = 0; index < this.plane.length; index++) {
      let pos = this.plane[index].getPosition();
      pos.z += 0.1;
      this.plane[index].setPosition(pos);
      if (this.plane[index].getPosition().z >= this.firstTilePosition.z) {
        this.plane[index].setPosition(this.lastTilePosition);
      }
    }
  }

  update(deltaTime: number) {
    this.planeMovement();
    this.obstacleMovement();
  }
}
