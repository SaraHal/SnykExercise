import axios from 'axios';
import PackageRepo from './package.repository';
import semver from 'semver';

export default class DependencyGetter {

    constructor() {
        this._packageRepo = new PackageRepo();
    }
    async getDependecies(packageName, packageVersion) {

        const deps = await this._packageRepo.getDependecies(`${packageName}@${packageVersion}`);
        if (deps) {

            return { version: packageVersion, dependencies: deps };
        }

        try {

            const res = await axios.get(`https://registry.npmjs.org/${packageName}/${packageVersion}`);

            const { dependencies = {}, version } = res.data;

            const _nestedDependecies = await Object.keys(dependencies)
                .reduce(async (deps, dep) => {
                    const _version = semver.coerce(dependencies[dep]).version;
                    const _innerDeps = await this.getDependecies(dep, _version);
                    return {
                        ...await deps,
                        [dep]: { ..._innerDeps }
                    };
                }, {});

            await this._packageRepo.insertVersion(`${packageName}@${version}`, _nestedDependecies);
            return { version, dependencies: _nestedDependecies };

        }
        catch (ex) {

            console.log(ex.response.status
                , packageName, packageVersion);
            throw ex;
        }


    }
}