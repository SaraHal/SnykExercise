
import express from 'express';
const path = require('path');
const app = express();

import DependencyGetter from './dependencyGetter';
const depGetter = new DependencyGetter();

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname ,'index.html'));
});

app.get('/:package/:version', (req, res) => {

    depGetter.getDependecies(req.params.package, req.params.version || 'latest')
        .then(deps => {
            res.send(deps);

        })
        .catch((ex) => {
            if (ex.response.status === 404)
                res.status(404)
                    .send('Not found');
            else res.status(500)
                .send('Internal Error');


        });



});

export default app;