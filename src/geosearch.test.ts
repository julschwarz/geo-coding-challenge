import { Geosearch } from '.';
import { data } from './geosearch.fixtures';

describe('geosearch', () => {
    const geosearch = new Geosearch();

    beforeAll(async () => geosearch.init(data));

    afterAll(async () => geosearch.shutdown());

    it('should pass', async () => {
        const {
            features: [feature1, feature2, feature3, point1, point2, point3],
        } = data;

        await expect(
            geosearch.find([13.409403562545775, 52.52084634012015], 30)
        ).resolves.toEqual({
            type: 'FeatureCollection',
            features: [],
        });

        await expect(
            geosearch.find([13.409403562545775, 52.52084634012015], 100)
        ).resolves.toEqual({
            type: 'FeatureCollection',
            features: [feature1, feature2, feature3, point1],
        });

        await expect(
            geosearch.find([13.407976627349854, 52.51927627894419], 90)
        ).resolves.toEqual({
            type: 'FeatureCollection',
            features: [point2, point3],
        });

        await expect(
            geosearch.find([13.410465717315674, 52.520128231784234], 50)
        ).resolves.toEqual({
            type: 'FeatureCollection',
            features: [feature1],
        });

        // edge case with point and buffer 0
        await expect(
            geosearch.find([13.40829849243164, 52.51995849537152], 0)
        ).rejects.toEqual('Radius cannot be 0 or lower');
    });
});
