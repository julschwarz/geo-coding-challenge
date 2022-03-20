import { Geosearch } from '.';
import { data } from './geosearch.fixtures';

describe('geosearch', () => {
    const geosearch = new Geosearch();
    const {
        features: [feature1, feature2, feature3, point1, point2, point3],
    } = data;

    describe('standard tests', () => {
        beforeAll(async () => geosearch.init(data));

        afterAll(async () => geosearch.shutdown());

        it('no feature within search area', async () => {
            await expect(
                geosearch.find([13.409403562545775, 52.52084634012015], 30)
            ).resolves.toEqual({
                type: 'FeatureCollection',
                features: [],
            });
        });

        it('feature1, feature2, feature3 and point1 intersect with the search area', async () => {
            await expect(
                geosearch.find([13.409403562545775, 52.52084634012015], 100)
            ).resolves.toEqual({
                type: 'FeatureCollection',
                features: [feature1, feature2, feature3, point1],
            });
        });

        it('point2 and point3 intersect with the search area', async () => {
            await expect(
                geosearch.find([13.407976627349854, 52.51927627894419], 90)
            ).resolves.toEqual({
                type: 'FeatureCollection',
                features: [point2, point3],
            });
        });

        it('feature1 intersects with the search area', async () => {
            await expect(
                geosearch.find([13.410465717315674, 52.520128231784234], 50)
            ).resolves.toEqual({
                type: 'FeatureCollection',
                features: [feature1],
            });
        });
    });

    describe('additional tests', () => {
        describe('edge cases', () => {
            beforeAll(async () => geosearch.init(data));

            afterAll(async () => geosearch.shutdown());

            it('input point1 with radius 0 should return point1', async () => {
                await expect(
                    geosearch.find([13.408910036087034, 52.5205950035378], 0)
                ).resolves.toEqual({
                    type: 'FeatureCollection',
                    features: [point1],
                });
            });

            it('input point and radius -1 should throw error', async () => {
                await expect(
                    geosearch.find([13.40829849243164, 52.51995849537152], -1)
                ).rejects.toThrowError('Radius cannot be lower than 0');
            });

            it('input point lying on the edge of a feature1 should return feature1', async () => {
                await expect(
                    geosearch.find([13.409720063209534, 52.52049055154815], 0)
                ).resolves.toEqual({
                    type: 'FeatureCollection',
                    features: [feature1],
                });
            });
        });

        describe('initializing and nulling of objects', () => {
            it('Throw error when ressource was shut down', async () => {
                await geosearch.shutdown();
                await expect(
                    geosearch.find([13.409720063209534, 52.52049055154815], 0)
                ).rejects.toThrowError(
                    'Geosearch object is not initialized. Call init() first.'
                );
            });

            it('Throw error when ressource was not initialized', async () => {
                const newGeosearch = new Geosearch();
                await expect(
                    newGeosearch.find(
                        [13.409720063209534, 52.52049055154815],
                        0
                    )
                ).rejects.toThrowError(
                    'Geosearch object is not initialized. Call init() first.'
                );
            });
        });
    });
});
