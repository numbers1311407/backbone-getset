module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: 
        '/*!\n * <%= pkg.title || pkg.name %> - <%= pkg.version %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' * Copyright(c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * <%= pkg.license %> License\n' +
        ' */\n'
    },

    preprocess: {
      build: {
        src: 'src/umd.js',
        dest: 'lib/backbone-getset.js'
      }
    },

    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      build: {
        src: ['lib/backbone-getset.js'],
        dest: 'lib/backbone-getset.js'
      }
    },

    uglify: {
      dist: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: "lib/backbone-getset.js",
        dest: "lib/backbone-getset.min.js"
      }
    },

    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'tdd'
      },

      all: { src: 'test/*.js' }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask("build", ["preprocess", "concat"]);
  grunt.registerTask("dist", ["build", "uglify"]);
  grunt.registerTask("default", ["build", "simplemocha"])
}
