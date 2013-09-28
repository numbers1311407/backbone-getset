module.exports = function (grunt) {

  grunt.initConfig({
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' + 
        '<%= pkg.homepage ? " * " + pkg.homepage + "\n *\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' */'
    },

    preprocess: {
      build: {
        src: 'src/umd.js',
        dest: 'lib/backbone-getset.js'
      }
    },

    uglify: {
      dist: {
        src: ["<banner>", "lib/backbone-getset.js"],
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
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask("build", "preprocess");
  grunt.registerTask("dist", ["build", "uglify"]);
  grunt.registerTask("default", ["build", "simplemocha"])
}
