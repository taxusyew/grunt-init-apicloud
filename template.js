exports.description = 'Create an apicloud project';
exports.warnOn = '*';
exports.template = function(grunt, init, done) {
    // See the "Inside an init template" section.
    init.process({}, [
        // Prompt for these values
        init.prompt('name'),
        init.prompt('description'),
        init.prompt('version'),
        init.prompt('author_name'),
        init.prompt('author_email')
    ], function(err, props) {
        // All finished, do something with the properties
        var files = init.filesToCopy(props);

        var licenses = ['MIT'];
        init.addLicenseFiles(files, licenses);

        // init.copyAndProcess(files, props, {noProcess: 'src/image/**'});
        init.copyAndProcess(files, props, {noProcess: '**/*.{png,gif,jpg,ico,psd,ttf,otf,woff,svg}'});

        init.writePackageJSON('package.json', {
            name: 'apicloud-app',
            version: '0.0.0-ignored',
            npm_test: 'grunt qunit',
            // TODO: pull from grunt's package.json
            node_version: '>= 0.8.0',
            devDependencies: {
                "grunt-contrib-clean": "^0.6.0",
                "grunt-contrib-cssmin": "^0.12.3",
                'grunt-contrib-concat': '~0.3.0',
                "grunt-contrib-copy": "^0.8.0",
                'grunt-contrib-uglify': '~0.2.0',
                "grunt-usemin": "^3.0.0"
            },
        });

        done();
    });
};


