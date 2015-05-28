'use strict';

var _concatIndex = 0;
var _uglifyIndex = 0;
var _cssminIndex = 0;

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> */\n',

        // Task configuration.
        clean: {
            build: ['.tmp/'],
            release: ['build/']
        },
        copy: {
            main: {
                files: [
                    // {expand: true, cwd : 'src/css/', src: ['**'], dest: 'build/css'},
                    {expand: true, cwd : 'src/icon/', src: ['**'], dest: 'build/icon'},
                    {expand: true, cwd : 'src/image/', src: ['**'], dest: 'build/image'},
                    {expand: true, cwd : 'src/lanuch/', src: ['**'], dest: 'build/lanuch'},
                    {expand: true, cwd : 'src/html/', src: ['**'], dest: 'build/html'},
                    {expand: true, cwd : 'src/', src: ['config.xml', 'index.html'], dest: 'build/'}
                ]
            }
        },
        useminPrepare: {
            html: {
                src : ['src/index.html', 'src/html/**/*.html']
            },
            options: {
                dest : 'build',
                flow: {
                    steps: {
                        css: ['concat', 'cssmin'],
                        js: ['concat', 'uglifyjs']
                    },
                    post: {
                        js: [{
                            name: 'concat',
                            createConfig: function(context, block) {
                                var destStr = context.options.generated.files[_concatIndex].dest;
                                var destArray = destStr.split('\\');
                                var destFileName = destArray[destArray.length-1];
                                context.options.generated.files[_concatIndex].dest = ".tmp\\concat\\script\\" + destFileName;
                                _concatIndex += 1;
                            }
                        },{
                            name: 'uglify',
                            createConfig: function(context, block) {
                                var destStr = context.options.generated.files[_uglifyIndex].dest;
                                var destArray = destStr.split('\\');
                                var destFileName = destArray[destArray.length-1];
                                context.options.generated.files[_uglifyIndex].dest = "build\\script\\" + destFileName;
                                context.options.generated.files[_uglifyIndex].src  = ".tmp\\concat\\script\\" + destFileName;
                                _uglifyIndex += 1;
                            }
                        }],
                        css : [{
                            name: 'concat',
                            createConfig: function(context, block) {
                                var destStr = context.options.generated.files[_concatIndex].dest;
                                var destArray = destStr.split('\\');
                                var destFileName = destArray[destArray.length-1];
                                context.options.generated.files[_concatIndex].dest = ".tmp\\concat\\css\\" + destFileName;
                                _concatIndex += 1;
                            }
                        },{
                            name: 'cssmin',
                            createConfig: function(context, block) {
                                var destStr = context.options.generated.files[_uglifyIndex].dest;
                                var destArray = destStr.split('\\');
                                var destFileName = destArray[destArray.length-1];
                                context.options.generated.files[_uglifyIndex].dest = "build\\css\\" + destFileName;
                                context.options.generated.files[_uglifyIndex].src  = ".tmp\\concat\\css\\" + destFileName;
                                _cssminIndex += 1;
                            }
                        }]
                    }
                }
            }
        },
        usemin: {
            options: {
                assetsDirs: ['build/']
            },
            html : {
                src : ['build/index.html', 'build/html/**/*.html']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');

    // Default task.
    // grunt.registerTask('default', ['copy', 'concat', 'uglify']);
    // grunt.registerTask('cp', ['copy']);
    grunt.registerTask('default', ['clean:release', 'copy', 'useminPrepare', 'concat:generated', 'cssmin:generated', 'uglify:generated', 'usemin', 'clean:build']);

};