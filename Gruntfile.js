var path = require('path');

module.exports = function(grunt){
  // Project configuration.
  grunt
      .initConfig({
        pkg : grunt.file.readJSON('package.json'),
        concat : {
          options : {},
          build : {
            nonull : true,
            src : [ 'build/*.tpl.js', 'src/js/*.js' ],
            dest : 'build/<%= pkg.name %>.js'
          }
        },
        uglify : {
          options : {
            banner : '/*! <%= pkg.name %> - v<%= pkg.version %> - '
                + '<%= grunt.template.today("yyyy-mm-dd") %> */',
          },
          build : {
            src : 'build/<%= pkg.name %>.js',
            dest : 'build/<%= pkg.name %>.min.js'
          }
        },
        html2js : {
          options : {
            htmlmin : {
              removeComments : true,
              collapseWhitespace : true,
              collapseBooleanAttributes : true,
              caseSensitive : true,
              removeRedundantAttributes : true,
            },
            module : function(jspath){
              var moduleName = path.basename(jspath.src[0]);
              var moduleNameNoExt = moduleName.substring(0, moduleName
                  .indexOf("."));
              return 'templates-' + moduleNameNoExt;
            }
          },
          build : {
            files : [ {
              expand : true,
              cwd : 'src/templates/',
              src : [ '*.tpl.html' ],
              dest : 'build/',
              ext : '.tpl.js',
            } ],
          }
        },
        clean : {
          build : [ 'build/*' ],
          dist : [ 'dist/*' ]
        },
        copy : {
          dist : {
            files : [ {
              expand : true,
              nonull : true,
              cwd : 'build/',
              src : [ '<%= pkg.name %>.min.js', '<%= pkg.name %>.js' ],
              dest : 'dist/'
            }, {
              expand : true,
              nonull : true,
              cwd : 'src/css/',
              src : '*.css',
              dest : 'dist/'
            } ]
          }
        },
        cssmin : {
          dist : {
            options : {
              banner : '/*! <%= pkg.name %> - v<%= pkg.version %> - '
                  + '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            files : [
                {
                  nonull : true,
                  expand : true,
                  cwd : 'src/css/',
                  src : [ '*.css' ],
                  dest : 'dist/',
                  ext : '.min.css'
                },
                {
                  'dist/<%= pkg.name %>.min.css' : [ 'src/css/*.css' ]
                } ]
          }
        }
      });

  // Load the plugin tasks
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-html2js');

  grunt.registerTask('clean-all', [ 'clean:build', 'clean:dist' ]);
  grunt.registerTask('build-js', [ 'html2js:build', 'concat:build',
      'uglify:build' ]);
  grunt.registerTask('dist-css', [ 'cssmin:dist' ]);
  grunt.registerTask('dist',
      [ 'clean-all', 'build-js', 'dist-css', 'copy:dist' ]);
  grunt.registerTask('default', [ 'dist' ]);
};
