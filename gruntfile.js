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
    },

    // Starts a server for running tests in the browser
    connect: {
      mocha: {
        options: {
          base: [ './', 'test' ],
          debug: true,
          open: true,
          keepalive: true
        }
      }
    },

    blanket_mocha : {    
      test: {
        src: ['test/index.html'],                
        options: {    
          threshold: 0,
          globalThreshold: 0,
          log: true,
          logErrors: true
        }                
      }
    }

  });

  grunt.registerTask( 'default', 'Run tests and build', ['test', 'build'] );
  grunt.registerTask( 'test', 'Run unit tests', ['jshint', 'blanket_mocha'] );
  grunt.registerTask( 'browser-test', 'Run unit tests', ['connect'] );
  grunt.registerTask( 'build', 'Build and generate source map', ['uglify'] );

};