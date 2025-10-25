/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

import Map from './Map';

export default class MapRotation {
    public maps: Map[] = [];

    public getMaps(): Map[] {
        return this.maps;
    }

    public setMaps(maps: Map[]): void {
        this.maps = maps;
    }

    public isEmpty(): boolean {
        return (this.maps.length === 0);
    }

    public fromJSON(mapRotation: any) {
        this.maps = [];

        if(mapRotation.maps && Array.isArray(mapRotation.maps)) {
            this.maps = mapRotation.maps.map((map: any) => {
                let newMap = new Map();
                newMap.fromJSON(map);
                return newMap;
            });
        }
    }

    public toJSON(): any {
        return {
            maps: this.maps.map(map => map.toJSON())
        };
    }
}