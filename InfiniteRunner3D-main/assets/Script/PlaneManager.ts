import { _decorator, Component, Node, Prefab, Vec3, instantiate, BoxCollider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlaneManager')
export class PlaneManager extends Component {
    @property({type:Node})
    PlaneParent:Node=null;
    @property({type:Prefab})
    PlanePrefabArray:Prefab[]=[]
    LastPosition;
    FirstPlanePosition:Vec3=new Vec3(-480,-320,10);
    start() {
        for(let planeindex=0;planeindex<this.PlanePrefabArray.length;planeindex++){
            let Plane=instantiate(this.PlanePrefabArray[planeindex]);
            let width=Plane.getComponent(BoxCollider).size.z;
          
            Plane.setPosition(new Vec3(this.FirstPlanePosition.x,this.FirstPlanePosition.y,this.FirstPlanePosition.z-width*planeindex))
            this.PlaneParent.addChild(Plane);
           this.LastPosition=Plane.getPosition();
        }
     
    }
    planeMovement() {
       console.log("START")
       this.PlaneParent.children.forEach((Child) => {
        let currentPosition=Child.getPosition();
        currentPosition.z+=0.1;
        Child.setPosition(currentPosition);
        
        if(Child.getPosition().z>(this.FirstPlanePosition.z+10)){
             Child.destroy();
             console.log("AAAA")
             let randomindex = Math.floor(Math.random() *8);
             let plane=instantiate(this.PlanePrefabArray[randomindex]);
             plane.setPosition(new Vec3(this.LastPosition.x,this.LastPosition.y,this.LastPosition.z+10));
            this.PlaneParent.addChild(plane);
           console.log("POSITION SET",plane.getPosition());
         
        }
    }
       );

      }

    update(deltaTime: number) {
        this.planeMovement(); 
       
        
    }
}


