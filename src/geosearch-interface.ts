import { FeatureCollection, Point, Polygon, Position } from '@vpriem/geojson';

export interface GeosearchInterface {
    /**
     * Initialize with a feature collection of points and polygons
     * Spin up resources
     *
     * @async
     * @param {FeatureCollection<Polygon | Point>} data
     * @return {void}
     */
    init(data: FeatureCollection<Polygon | Point>): Promise<void>;

    /**
     * Return a feature collection of points and polygons around a certain radius
     * or an empty feature collection if not
     *
     * @async
     * @param {Position} position
     * @param {number} radius in meter
     * @return {FeatureCollection<Polygon | Point>}
     */
    find(
        position: Position,
        radius: number
    ): Promise<FeatureCollection<Polygon | Point>>;

    /**
     * Shutdown resources
     *
     * @async
     * @return {void}
     */
    shutdown(): Promise<void>;
}
