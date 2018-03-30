// This shows a full config file!
module.exports = function (grunt) {
  grunt.initConfig({
    watch: {
      files: 'src/scss/**/*.scss',
      tasks: ['sass']
    },
    sass: {
      dev: {
        files: {
          'src/css/main.css': 'src/scss/main.scss'
        }
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'src/js/*.js',
            'src/css/*.css',
            'src/*.html'
          ]
        },
        options: {
          watchTask: true,
          server: './src'
        }
      }
    }
  })

  // load npm tasks
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-browser-sync')

  // define default task
  grunt.registerTask('default', ['browserSync', 'watch'])
}
