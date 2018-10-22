import { JSONLoader, Geometry, Material, TextureLoader, Texture, Object3D, Mesh } from "THREE";

export function loadJSON(url: string, loader: JSONLoader): Promise<{ geometry: Geometry, materials: Material[]}> {
    return new Promise((resolve) => {
        loader.load(url, (g, m) => resolve({geometry: g, materials: m}));
    });
}

export function loadTexture(url: string, loader: TextureLoader): Promise<Texture>{
    return new Promise((resolve) => {
        loader.load(url, resolve);
    })
}

export function getSize(object: Mesh, scaleFn: (_:number) => number){
    object.geometry.computeBoundingBox();
    const boundingBox = object.geometry.boundingBox;
    const modelSize = {
        width: boundingBox.max.x - boundingBox.min.x,
        depth: boundingBox.max.z - boundingBox.min.z,
        height: boundingBox.max.y - boundingBox.min.y,
    };
    const scale = scaleFn(modelSize.width);
    object.scale.set(scale, scale, scale);
    return {
        width: modelSize.width * scale,
        depth: modelSize.depth * scale,
        height: modelSize.height * scale,
        scale,
    };
}
