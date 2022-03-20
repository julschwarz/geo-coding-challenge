import buffer from '@turf/buffer';
import { point } from '@turf/helpers';
import inside from '@turf/inside';
import intersect from '@turf/intersect';
import { FeatureCollection, Point, Polygon, Position } from '@vpriem/geojson';
import { GeosearchInterface } from './geosearch-interface';
export class Geosearch implements GeosearchInterface {
    geoFeatureCollection: FeatureCollection<Polygon | Point>;

    init(data: FeatureCollection<Polygon | Point>): Promise<void> {
        this.geoFeatureCollection = data;
        return new Promise((resolve) => resolve());
    }

    shutdown(): Promise<void> {
        this.geoFeatureCollection.features = [];
        return new Promise((resolve) => resolve());
    }

    find(
        position: Position,
        radius: number
    ): Promise<FeatureCollection<Polygon | Point>> {
        if (radius <= 0) return Promise.reject('Radius cannot be 0 or lower');

        const searchArea = buffer(point(position), radius, {
            units: 'meters',
        });

        const containedFeatures = this.geoFeatureCollection.features.filter(
            (geoFeature) => {
                return geoFeature.geometry.type == 'Point'
                    ? inside(geoFeature.geometry, searchArea.geometry)
                    : intersect(searchArea.geometry, geoFeature.geometry);
            }
        );

        return new Promise<FeatureCollection<Polygon | Point>>((resolve) => {
            resolve({
                type: 'FeatureCollection',
                features: containedFeatures,
            });
        });
    }
}
