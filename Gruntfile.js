'use strict';

module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  grunt.util.linefeed = '\n';

  grunt.initConfig({
    pkg: pkg,
    uglify: {
      build: {
        options: {
          sourceMap: true,
          sourceMapName: 'encoding.map',
          ASCIIOnly: true,
          maxLineLen: 8000,
          banner: [
            '/*!',
            ' * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>',
            ' * Copyright (c) 2013-2016 <%= pkg.author %>',
            ' * <%= pkg.homepage %>',
            ' * @license <%= pkg.license %>',
            ' */'
          ].join('\n')
        },
        files: {
          './encoding.min.js': './encoding.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify']);
};
