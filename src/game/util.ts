import { JSONLoader, Geometry, Material, TextureLoader, Texture } from "THREE";

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
