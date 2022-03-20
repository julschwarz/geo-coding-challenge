import booleanIntersects from '@turf/boolean-intersects';
import circle from '@turf/circle';
import { point } from '@turf/helpers';
import { FeatureCollection, Point, Polygon, Position } from '@vpriem/geojson';
import { GeosearchInterface } from './geosearch-interface';
export class Geosearch implements GeosearchInterface {
    geosearchFeatureCollection: FeatureCollection<Polygon | Point> | null;

    init(data: FeatureCollection<Polygon | Point>): Promise<void> {
        this.geosearchFeatureCollection = data;
        return Promise.resolve();
    }

    shutdown(): Promise<void> {
        this.geosearchFeatureCollection = null;
        return Promise.resolve();
    }

    /**
     * Takes a {@link Position} and a {@link Radius} in meters and filters the Geosearch features for
     * shapes intersecting with the given search area.
     * If the search area and the Geosearch feature have at least one point in common the Geosearch feature is retured.
     *
     * @param {Position} position input coordinates
     * @returns {Promise<FeatureCollection<Polygon>>} polygons that contain the position
     */
    find(
        position: Position,
        radius: number
    ): Promise<FeatureCollection<Polygon | Point>> {
        if (radius < 0)
            return Promise.reject(new Error('Radius cannot be lower than 0'));
        if (!this.geosearchFeatureCollection)
            return Promise.reject(
                new Error(
                    'Geosearch object is not initialized. Call init() first.'
                )
            );

        const searchArea =
            radius == 0
                ? point(position)
                : circle(position, radius, {
                      units: 'meters',
                  });

        const containedFeatures =
            this.geosearchFeatureCollection.features.filter((geoFeature) => {
                return booleanIntersects(
                    geoFeature.geometry,
                    searchArea.geometry
                );
            });

        return Promise.resolve({
            type: 'FeatureCollection',
            features: containedFeatures,
        });
    }
}
