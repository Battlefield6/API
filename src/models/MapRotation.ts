/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

import Map from './Map';

export default class MapRotation {
    private maps: Map[] = [];

    /**
     * Gets the maps in the rotation.
     * 
     * @returns The maps in the rotation.
     */
    public getMaps(): Map[] {
        return this.maps;
    }

    /**
     * Sets the maps in the rotation.
     * 
     * @param maps The maps in the rotation.
     */
    public setMaps(maps: Map[]): void {
        this.maps = maps;
    }

    /**
     * Checks if the map rotation is empty.
     * 
     * @returns True if the map rotation is empty, false otherwise.
     */
    public isEmpty(): boolean {
        return (this.maps.length === 0);
    }

    /**
     * Populates the map rotation from a JSON object.
     * 
     * @param mapRotation The JSON object.
     */
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

    /**
     * Converts the map rotation to a JSON object.
     * 
     * @returns The JSON object.
     */
    public toJSON(): any {
        return {
            maps: this.maps.map(map => map.toJSON())
        };
    }
}