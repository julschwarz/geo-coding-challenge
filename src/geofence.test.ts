import { Geofence } from '.';
import { data } from './geofence.fixtures';

describe('geofence', () => {
    const geofence = new Geofence();
    const {
        features: [feature1, feature2],
    } = data;

    describe('standard tests', () => {
        beforeAll(async () => geofence.init(data));

        afterAll(async () => geofence.shutdown());

        it('position outside geofence', async () => {
            await expect(
                geofence.set([13.414188623428345, 52.52177986340841])
            ).resolves.toEqual({
                type: 'FeatureCollection',
                features: [],
            });

            await expect(
                geofence.set([13.411876559257507, 52.52180597566276])
            ).resolves.toEqual({
                type: 'FeatureCollection',
                features: [],
            });
        });

        it('position is inside feature1 and feature2', async () => {
            await expect(
                geofence.set([13.413276672363281, 52.52185167207047])
            ).resolves.toEqual({
                type: 'FeatureCollection',
                features: [feature1, feature2],
            });
        });

        it('position is inside feature1', async () => {
            await expect(
                geofence.set([13.412590026855469, 52.521812503723915])
            ).resolves.toEqual({
                type: 'FeatureCollection',
                features: [feature1],
            });
        });
    });

    describe('additional tests', () => {
        describe('edge cases', () => {
            beforeAll(async () => geofence.init(data));

            afterAll(async () => geofence.shutdown());

            it('input point on edge of feature1 should not return feature1', async () => {
                await expect(
                    geofence.set([13.41380774974823, 52.52221724162107])
                ).resolves.toEqual({
                    type: 'FeatureCollection',
                    features: [],
                });
            });
        });

        describe('initializing and nulling of objects', () => {
            it('Throw error when ressource was shut down', async () => {
                await geofence.shutdown();
                await expect(
                    geofence.set([13.409720063209534, 52.52049055154815])
                ).rejects.toThrowError(
                    'Geofence object is not initialized. Call init() first.'
                );
            });

            it('Throw error when ressource was not initialized', async () => {
                const newGeofence = new Geofence();
                await expect(
                    newGeofence.set([13.409720063209534, 52.52049055154815])
                ).rejects.toThrowError(
                    'Geofence object is not initialized. Call init() first.'
                );
            });
        });
    });
});
