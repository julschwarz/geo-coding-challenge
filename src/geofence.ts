import inside from '@turf/inside';
import { FeatureCollection, Polygon, Position } from '@vpriem/geojson';
import { GeofenceInterface } from './geofence-interface';
export class Geofence implements GeofenceInterface {
    fence: FeatureCollection<Polygon>;

    init(data: FeatureCollection<Polygon>): Promise<void> {
        this.fence = data;
        return new Promise((resolve) => resolve());
    }

    set(position: Position): Promise<FeatureCollection<Polygon>> {
        const overlappingFencePolygons = this.fence.features.filter(
            (fencePolygon) => inside(position, fencePolygon.geometry)
        );

        return new Promise<FeatureCollection<Polygon>>((resolve) => {
            resolve({
                type: 'FeatureCollection',
                features: overlappingFencePolygons,
            });
        });
    }

    shutdown(): Promise<void> {
        this.fence.features = [];
        return new Promise((resolve) => resolve());
    }
}
