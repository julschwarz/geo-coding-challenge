import { FeatureCollection, Polygon, Position } from '@vpriem/geojson';

export interface GeofenceInterface {
    /**
     * Initialize with a feature collection of polygons
     * Spin up resources
     *
     * @async
     * @param {FeatureCollection<Polygon>} data
     * @return {void}
     */
    init(data: FeatureCollection<Polygon>): Promise<void>;

    /**
     * Return a feature collection of polygons in which the position is inside
     * or an empty feature collection if not
     *
     * @async
     * @param {Position} position
     * @return {FeatureCollection<Polygon>}
     */
    set(position: Position): Promise<FeatureCollection<Polygon>>;

    /**
     * Shutdown resources
     *
     * @async
     * @return {void}
     */
    shutdown(): Promise<void>;
}
