import { resolve } from 'dns';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

export default class PackageRepository {
    constructor() {
        db.serialize(function () {

            db.run("CREATE TABLE packages (version TEXT PRIMARY KEY, dependencies BLOB)");
        });


    }

    insertVersion(version, dependencies) {

        return new Promise(resolve => {
            db.serialize(function () {
                db.run("INSERT INTO packages VALUES (?,?)", version, JSON.stringify(dependencies), () => {
                    resolve();
                });


            })
        });
    }

    getDependecies(version) {
      
        const promise = new Promise(resolve => {
            db.serialize(function () {

                db.get(`SELECT version,dependencies FROM packages WHERE version='${version}'`, function (err, _package) {
      
                    if (_package) {
                        const { dependencies, version } = _package;
                        resolve(JSON.parse(dependencies));
                    }
                    else {
                        resolve();
                    }
                });

            });
        });

        return promise;

    }
}