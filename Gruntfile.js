/*global module:false*/
'use strict';

var env = process.env.NODE_ENV || 'development'

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt)

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt)

  // Project configuration.
  grunt.initConfig({

    // Project settings
    conf: {
      // configurable paths
      app: 'app/assets',
      dist: 'public',
      config: 'config',
      env: env
    },

    watch: {
      js: {
        files: ['app/**/*.js'],
        tasks: ['jshint:all', 'copy:dev']
      },
      css: {
        files: ['app/assets/css/**/*.css'],
        tasks: ['copy:dev']
      },
      views: {
        files: ['<%= conf.app %>/views/**/*.html'],
        tasks: ['copy:dev']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        // reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'index.js',
        '<%= conf.app %>/js/**/*.js',
        'app/middleware/**/*.js',
        'app/models/**/*.js',
        'app/routes/**/*.js'
      ]
    },

    // Empties folders to start fresh
    clean: {
      'public': {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= conf.dist %>/bower_components/**/*',
            '<%= conf.dist %>/css/**/*',
            '<%= conf.dist %>/fonts/**/*',
            '<%= conf.dist %>/img/**/*',
            '<%= conf.dist %>/js/**/*',
            '<%= conf.dist %>/views/**/*',
            '<%= conf.dist %>/favicon.ico',
            '!<%= conf.dist %>/.git*'
          ]
        }]
      }
    },

    // Automatically inject Bower components into the app
    'bower-install': {
      app: {
        src: 'app/views/home.ejs',
        ignorePath: 'app/assets/',
        fileTypes: {
          html: {
            replace: {
              js: '<script src="/{{filePath}}"></script>'
            }
          }
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      prod: {
        files: {
          src: [
            '<%= conf.dist %>/js/**/*.js',
            '<%= conf.dist %>/css/**/*.css',
            '<%= conf.dist %>/img/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= conf.dist %>/fonts/**/*.{eot,svg,ttf,woff}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      // html: '<%= conf.app %>/views/layout.html',
      html: ['<%= conf.app %>/views/**/*.html'],
      options: {
        dest: '<%= conf.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= conf.dist %>/views/**/*.html'],
      css: ['<%= conf.dist %>/css/**/*.css'],
      options: {
        assetsDirs: ['<%= conf.dist %>']
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      prod: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/js',
          src: '*.js',
          dest: '.tmp/concat/js'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      prod: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= conf.app %>',
          dest: '<%= conf.dist %>',
          src: [
            'views/**/*.html',
            'bower_components/**/*',
            'img/**/*',
            'css/**/*'
          ]
        }]
      },
      dev: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= conf.app %>',
          dest: '<%= conf.dist %>',
          src: [
            'bower_components/**/*',
            'js/**/*',
            'views/**/*',
            'img/**/*',
            'css/**/*'
          ]
        }]
      }
    }

  })

  // Default task.
  grunt.registerTask('default', [
    'clean:public',
    'bower-install',
    'copy:dev'
  ])

  grunt.registerTask('heroku', [
    'clean:public',
    'bower-install',
    'useminPrepare',
    // concat is created dynamically by useminPepare
    'concat',
    'ngmin',
    'copy:prod',
    // uglify is created dynamically by useminPepare
    'uglify',
    'rev',
    'usemin'
  ])

}
