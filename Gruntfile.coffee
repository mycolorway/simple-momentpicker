module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'
    name: "momentpicker"

    sass:
      styles:
        options:
          bundleExec: true
          style: 'expanded'
          sourcemap: 'none'
        files:
          'styles/<%= name %>.css': 'styles/<%= name %>.scss'

    coffee:
      src:
        options:
          bare: true
        files:
          'lib/<%= name %>.js': [
            'src/view.coffee'
            'src/<%= name %>.coffee'
            'src/*.coffee'
          ]
      spec:
        files:
          'spec/<%= name %>-spec.js': 'spec/<%= name %>-spec.coffee'

    umd:
      all:
        src: 'lib/<%= name %>.js'
        template: 'umd.hbs'
        amdModuleId: '<%= pkg.name %>'
        objectToExport: '<%= name %>'
        globalAlias: '<%= name %>'
        deps:
          'default': ['$', 'SimpleModule']
          amd: ['jquery', 'simple-module']
          cjs: ['jquery', 'simple-module']
          global:
            items: ['jQuery', 'SimpleModule']
            prefix: ''

    watch:
      styles:
        files: ['styles/*.scss']
        tasks: ['sass']
      spec:
        files: ['spec/**/*.coffee']
        tasks: ['coffee:spec']
      src:
        files: ['src/**/*.coffee']
        tasks: ['coffee:src', 'umd']
      # jasmine:
      #   files: ['lib/**/*.js', 'spec/**/*.js']
      #   tasks: 'jasmine'

    jasmine:
      test:
        src: ['lib/**/*.js']
        options:
          outfile: 'spec/index.html'
          styles: 'styles/<%= name %>.css'
          specs: 'spec/<%= name %>-spec.js'
          vendor: [
            'vendor/bower/jquery/dist/jquery.min.js'
            'vendor/bower/jasmine-jquery/lib/jasmine-jquery.js'
            'vendor/bower/simple-module/lib/module.js'
            'vendor/bower/moment/moment.js'
          ]

  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-umd'

  grunt.registerTask 'default', ['sass', 'coffee', 'umd', 'watch']
  grunt.registerTask 'test', ['sass', 'coffee', 'umd', 'jasmine']
