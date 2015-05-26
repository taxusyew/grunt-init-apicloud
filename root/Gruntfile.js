'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> */\n',

        // Task configuration.
        copy: {
            main: {
                files: [
                    {expand: true, cwd : 'src/css/', src: ['**'], dest: 'build/css'},
                    {expand: true, cwd : 'src/icon/', src: ['**'], dest: 'build/icon'},
                    {expand: true, cwd : 'src/image/', src: ['**'], dest: 'build/image'},
                    {expand: true, cwd : 'src/lanuch/', src: ['**'], dest: 'build/lanuch'},
                    {expand: true, cwd : 'src/html/', src: ['**'], dest: 'build/html'},
                    {expand: true, cwd : 'src/', src: ['config.xml', 'index.html'], dest: 'build/'}
                ]
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['src/script/*.js'],
                dest: 'build/script/apicloud.<%= pkg.name %>.js'
            },
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'build/script/apicloud.<%= pkg.name %>.min.js'
            },
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task.
    grunt.registerTask('default', ['copy', 'concat', 'uglify']);
    grunt.registerTask('cp', ['copy']);

};