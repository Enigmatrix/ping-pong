import "file-loader!./index.html";
import * as THREE from "THREE";
import {WebGLRenderer, PerspectiveCamera, Scene, DirectionalLight, Light, JSONLoader, Geometry, Material, ImageUtils, Texture, MeshPhongMaterial, RepeatWrapping, Mesh, MeshFaceMaterial, NumberKeyframeTrack, Vector3, PointLight, SpotLight, DoubleSide, PlaneGeometry} from "THREE";

export default class Game {
    public renderer: WebGLRenderer;
    public camera: PerspectiveCamera;
    public scene: Scene;
    public light: Light;
    public settings = {
        width: 10,
        height: 5,
        depth: 20,
        tableWidth: 1.5,
    };
    public tableSize: {
        width: number,
        depth: number,
        height: number,
        scale: number
    }

    private canvas: HTMLCanvasElement;

    constructor() {
        this.canvas = document.createElement("canvas");
        this.renderer = new WebGLRenderer({ antialias: true, canvas: this.canvas });
        this.renderer.setClearColor(0x000000);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";

        this.scene = new Scene();
        window.scene = this.scene;
        window.THREE = THREE;
        this.camera = new PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.5, 20);
		this.scene.add(this.camera);
		this.camera.position.set(0, this.settings.width/2,this.settings.depth/2);
        this.camera.lookAt(this.scene.position);
        
        let light = new PointLight(0xffffff);
        light.position.set(0,2.5,2);
        this.scene.add(light);
        
        light = new SpotLight( 0xffffff, 0.8 );
        light.position.set( 0, 2.0, 4.0 );
        light.position.set( 0, 0, 0.2 );
        light.updateMatrixWorld(true);
        this.scene.add(light);

        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });
    }
    async init() {
        let loader = new JSONLoader();
        await Promise.all([this.loadPlanes(), this.loadTable(loader)]);

        requestAnimationFrame(this.render.bind(this));
    }
    async loadPlanes(){
        let {width, depth, height} = this.settings;
        let planes = [
            {texture:"../assets/images/floor4.jpg", size:[width,depth], repeat:[6,6], rotation:[-Math.PI/2,0, 0]}, //floor
            {texture:"../assets/images/wall.jpg" , size:[width,height], position:[0, height/2, -depth/2]}, //front wall
            {texture:"../assets/images/wall.jpg" , size:[width,height], rotation:[0, Math.PI,0], position:[0, height/2, depth/2]}, //back wall
            {texture:"../assets/images/wall.jpg" , size:[depth,height], scale:[-1,1,1],rotation:[0, Math.PI/2, 0], position:[-width/2, height/2, 0]}, //left wall
            {texture:"../assets/images/wall.jpg" , size:[depth,height], scale:[-1,1,1], rotation:[0, -Math.PI/2, 0], position:[width/2, height/2, 0]} //right wall
        ];
        for (let i = 0; i < planes.length; i++) {
            let plane = planes[i];
            let planeMaterial = new MeshPhongMaterial({ map: ImageUtils.loadTexture(plane.texture), side: DoubleSide}); 
            if(!planeMaterial || !planeMaterial.map) return; 
            planeMaterial.map.wrapS = RepeatWrapping; 
            planeMaterial.map.wrapT = RepeatWrapping; 
            let repeat = plane.repeat || [1,1];
            planeMaterial.map.repeat.set(repeat[0],repeat[1]);
            
            let planeGeometry = new PlaneGeometry(plane.size[0], plane.size[1], 10, 10);
            let planeMesh = new Mesh(planeGeometry, planeMaterial);
            
            if (plane.rotation) {
                planeMesh.rotation.set(plane.rotation[0], plane.rotation[1], plane.rotation[2]);
            }
            if (plane.scale) {
                planeMesh.scale.set(plane.scale[0], plane.scale[1], plane.scale[2]);
            }
            if (plane.position) {
                planeMesh.position.set(plane.position[0], plane.position[1], plane.position[2]);
            }
            this.scene.add(planeMesh);
        }
    }
    async loadTable(loader: JSONLoader){
        let {geometry, materials} = await this.loadJSON("../assets/models/table.js", loader);
        let texture = ImageUtils.loadTexture("../assets/images/table.jpg");
        texture.repeat.x = 0.1;
        texture.repeat.y = 0.03;
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping;
        materials[1] = new MeshPhongMaterial({ specular: 0x777777, map: texture });
        let table = new Mesh(geometry, new MeshFaceMaterial(materials));
        geometry.computeBoundingBox();
        let boundingBox = geometry.boundingBox;
        let modelSize = {
            width: boundingBox.max.x - boundingBox.min.x, 
            depth: boundingBox.max.z - boundingBox.min.z, 
            height: boundingBox.max.y - boundingBox.min.y
        };
                        
        let scale = this.settings.tableWidth / modelSize.width;
        table.scale.set(scale, scale, scale);
        this.tableSize = {width: modelSize.width * scale, depth: modelSize.depth * scale, height: modelSize.height * scale, scale: scale};
        
        this.camera.position.set(0, this.tableSize.height * 1.7, this.tableSize.depth/2 * 2.3);
        this.camera.lookAt(new Vector3(0, this.tableSize.height, 0));
        table.matrixAutoUpdate = false;
        table.updateMatrix();
        this.scene.add(table);
    }
    loadJSON(url: string, loader: JSONLoader): Promise<{ geometry: Geometry, materials: Material[]}> {
        return new Promise(resolve => {
            loader.load(url, (g, m) => resolve({geometry: g, materials: m}));
        });
    }
    update() {
        
    }
    render() {
        this.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

}
const game = new Game();
game.init().then();
