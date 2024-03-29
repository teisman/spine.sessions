module.exports = (grunt) ->
  grunt.initConfig
    pkg:
      grunt.file.readJSON 'package.json'
    
    coffee:
      compile:
        files:
          'lib/application.js': [
            'src/models/session.coffee'
            'src/controllers/sessions.coffee'
          ]

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.registerTask 'default', ['coffee']

