const request = require('supertest');
import app from '../src/app';
import axios from 'axios';

var MockAdapter = require('axios-mock-adapter');
var mock = new MockAdapter(axios);

describe('Get :package/:version', () => {


    afterEach(() => {
        mock.reset();

    })
    test('Returns dependecies tree', async (done) => {

        //arrange

        mock.onGet('https://registry.npmjs.org/body-parser/1.19.0').reply(200, {
            "version": "1.19.0",
            "dependencies": {
                "bytes": "3.1.0",
                "content-type": "~1.0.4"
            }
        });
        mock.onGet('https://registry.npmjs.org/bytes/3.1.0').reply(200, {
            "version": "3.1.0",
            "dependencies": {}
        });
        mock.onGet('https://registry.npmjs.org/content-type/1.0.4').reply(200, {
            "version": "1.0.4",
            "dependencies": {}
        });

        //act
        const response = await request(app).get(`/body-parser/1.19.0`)

        //assert
        const exceptedObject =
        {
            version: '1.19.0',
            dependencies:
            {
                bytes: { version: '3.1.0', dependencies: {} },
                'content-type': { version: '1.0.4', dependencies: {} }
            }
        };

        expect(response.body).toEqual(exceptedObject);
        done();

    });

    test('Returns 404 when not found', async (done) => {

        //arrange
        mock.onGet('https://registry.npmjs.org/body-parser/1.19.1').reply(404, "version not found: 10.5.0");


        //act
        const response = await request(app).get(`/body-parser/1.19.1`)

        //assert

        expect(response.status).toEqual(404);
        done();

    });



});

