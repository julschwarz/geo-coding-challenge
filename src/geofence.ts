import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { FeatureCollection, Polygon, Position } from '@vpriem/geojson';
import { GeofenceInterface } from './geofence-interface';

export class Geofence implements GeofenceInterface {
    fence?: FeatureCollection<Polygon>;

    init(data: FeatureCollection<Polygon>): Promise<void> {
        this.fence = data;
        return Promise.resolve();
    }

    /**
     * Takes a {@link Position} and filters the fence for polygons that contain it.
     * If the position lies on the boundary of a geofence polygon the polygon won't be returned
     *
     * @param {Position} position input coordinates
     * @returns {Promise<FeatureCollection<Polygon>>} polygons that contain the position
     */
    set(position: Position): Promise<FeatureCollection<Polygon>> {
        if (!this.fence)
            return Promise.reject(
                new Error(
                    'Geofence object is not initialized. Call init() first.'
                )
            );

        const overlappingFencePolygons = this.fence.features.filter(
            (fencePolygon) =>
                booleanPointInPolygon(position, fencePolygon.geometry, {
                    ignoreBoundary: true,
                })
        );

        return Promise.resolve({
            type: 'FeatureCollection',
            features: overlappingFencePolygons,
        });
    }

    shutdown(): Promise<void> {
        delete this.fence;
        return Promise.resolve();
    }
}
