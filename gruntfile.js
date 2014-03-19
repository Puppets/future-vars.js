module.exports = function( grunt ) {

  require( 'load-grunt-tasks' )( grunt );

  grunt.initConfig({

    jshint: {
      main: {
        options: {
          laxcomma: true
        },
        src: 'future-vars.js'
      }
    },

    uglify: {
      main: {
        options: {
          sourceMap: true
        },
        src: 'future-vars.js',
        dest: 'future-vars.min.js'
      }
    }

  });

  grunt.registerTask( 'default', 'Run tests and build', ['jshint', 'uglify'] );

};