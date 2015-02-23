module.exports = function (grunt) {
    var publicDir ='../public/',
        pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,
        version:pkg.version,
        sourceDir: '../sources/',
        publicDir:publicDir,
        prodBuildDir: '../../new-vision-build/',
        scriptsDir: publicDir + 'scripts/',
        vendorDir: publicDir + 'vendor/',
        stylesDir: publicDir + 'styles/',
        copy:{
            htmlDevSource:{
                expand: true,
                cwd: '<%= sourceDir %>',
                src: ['**/*.html'],
                dest: '<%= publicDir %>'
            },
            images: {
                expand: true,
                cwd: '<%= publicDir %>images/',
                src: '**',
                dest: '<%= prodBuildDir %>images/'
            },
            vendorScripts:{
                expand: true,
                cwd: '<%= publicDir %>vendor/scripts/',
                src: '**',
                dest: '<%= prodBuildDir %>scripts/vendor/'
            },
            vendorStyles:{
                expand: true,
                cwd: '<%= publicDir %>vendor/styles/',
                src: '**',
                dest: '<%= prodBuildDir %>styles/vendor/'
            },
            fonts: {
                expand: true,
                cwd: '<%= publicDir %>fonts/',
                src: '**',
                dest: '<%= prodBuildDir %>fonts/'
            },
            data: {
                expand: true,
                cwd: '<%= publicDir %>data/',
                src: '**',
                dest: '<%= prodBuildDir %>data/'
            },
            htmlSource: {
                expand: true,
                cwd: '<%= sourceDir %>',
                src: ['**/*.html'],
                dest: '<%= prodBuildDir %>'
            }
        },
        includes:{
            dev: {
                files: [
                    {
                        cwd: '<%= publicDir %>',
                        src: '**/*.html',
                        dest: '<%= publicDir %>'
                    }
                ]
            },
            prod: {
                files: [
                    {
                        cwd: '<%= prodBuildDir %>',
                        src: '**/*.html',
                        dest: '<%= prodBuildDir %>'
                    }
                ]
            }
        },
        tags:{
            buildDevScripts:{
                options: {
                    scriptTemplate: '    <script type="text/javascript" src="{{path}}?v=<%= version %>"></script>',
                    openTag: '<!-- start script template tags -->',
                    closeTag: '<!-- end script template tags -->'
                },
                src: [
                    //'<%= scriptsDir %>constants/constantsDefine.js',
                    //'<%= scriptsDir %>constants/**/*.js',
                    '<%= scriptsDir %>a9/A9.js',
                    '<%= scriptsDir %>a9/helpers/**/*.js',
                    '<%= scriptsDir %>a9/UIComponents/**/*.js',
                    //'<%= scriptsDir %>a9/masking/masking.js',
                    //'<%= scriptsDir %>a9/masking/masks/decimal.js',
                    //'<%= scriptsDir %>a9/masking/masks/**/*.js',
                    //'<%= scriptsDir %>a9/masking/**/*.js',
                    '<%= scriptsDir %>a9/validation/validation.js',
                    '<%= scriptsDir %>a9/validation/helpers/**/*.js',
                    '<%= scriptsDir %>a9/validation/microvalidators/**/*.js',
                    '<%= scriptsDir %>a9/validation/validators/dependency/dependency.js',
                    '<%= scriptsDir %>a9/validation/validators/**/*.js',
                    '<%= scriptsDir %>a9/validation/**/*.js',
                    '<%= scriptsDir %>libs/awareness/**/*.js',
                    '<%= scriptsDir %>libs/faith/**/*.js',
                    '<%= scriptsDir %>libs/cnCt/**/*.js',
                    //'<%= scriptsDir %>libs/jmForms/jmForms.js',
                    //'<%= scriptsDir %>libs/jmForms/helpers/**/*.js',
                    //'<%= scriptsDir %>libs/jmForms/commonTmpls/microTmpls.js',
                    //'<%= scriptsDir %>libs/jmForms/commonTmpls/**/*.js',
                    //'<%= scriptsDir %>libs/jmForms/fields/**/*.js',
                    //'<%= scriptsDir %>libs/jmForms/indications/**/*.js',
                    //'<%= scriptsDir %>vostokInternetBank/defined/**/*.js',
                    '<%= scriptsDir %>newVisionProductions/NV.js',
                    '<%= scriptsDir %>newVisionProductions/modules/**/*.js',
                    '<%= scriptsDir %>newVisionProductions/elements/**/*.js',
                    '<%= scriptsDir %>newVisionProductions/**/*.js',
                    '<%= vendorDir %>scripts/jquery-1.11.2.min.js',
                    '<%= vendorDir %>scripts/jquery.bxslider.min.js',
                    '<%= vendorDir %>scripts/init.js',
                    '<%= scriptsDir %>init.js'
                ],
                dest: '<%= publicDir %>includes/scripts.html'
            },
            buildDevLinks: {
                options: {
                    linkTemplate: '    <link rel="stylesheet" type="text/css" href="{{path}}?v=<%= version %>" media="screen"/>',
                    openTag: '<!-- start css template tags -->',
                    closeTag: '<!-- end css template tags -->'
                },
                src: [
                    //'!<%= stylesDir %>_services/**/*.css',
                    '<%= stylesDir %>default.css',
                    //'<%= stylesDir %>ui/default/*.css',
                    //'<%= stylesDir %>ui/**/*.css',
                    '<%= stylesDir %>blocks/**/*.css',
                    '<%= stylesDir %>pages/*.css',
                    '<%= stylesDir %>layout/*.css',
                    //'<%= stylesDir %>fonts/*.css',
                    // '<%= stylesDir %>*.css'
                    '<%= vendorDir %>styles/*.css'
                ],
                dest: '<%= publicDir %>includes/styles.html'
            },
            buildScripts: {
                options: {
                    scriptTemplate: '    <script type="text/javascript" src="{{path}}?v=<%= version %>"></script>',
                    openTag: '<!-- start script template tags -->',
                    closeTag: '<!-- end script template tags -->'
                },
                src: [
                    '<%= prodBuildDir %>scripts/vendor/jquery-1.11.2.min.js',
                    '<%= prodBuildDir %>scripts/vendor/jquery.bxslider.min.js',
                    '<%= prodBuildDir %>scripts/vendor/init.js',
                    '<%= prodBuildDir %>scripts/main.min.js'
                ],
                dest: '<%= prodBuildDir %>includes/scripts.html'
            },
            buildLinks: {
                options: {
                    linkTemplate: '    <link rel="stylesheet" type="text/css" href="{{path}}?v=<%= version %>" media="screen"/>',
                    openTag: '<!-- start css template tags -->',
                    closeTag: '<!-- end css template tags -->'
                },
                src: [
                    '<%= prodBuildDir %>styles/main.min.css',
                    '<%= prodBuildDir %>styles/vendor/*.js'
                ],
                dest: '<%= prodBuildDir %>includes/styles.html'
            }
        },
        clean:{
            dev: {
                options: { force: true },
                src: ['<%= publicDir %>includes']
            },
            prod: {
                options: { force: true },
                src: ['<%= prodBuildDir %>includes', '<%= prodBuildDir %>scripts/main.js', '<%= prodBuildDir %>styles/main.css']
            }
        },
        concat:{
            js:{
                src: [
                    //'<%= scriptsDir %>constants/constantsDefine.js',
                    //'<%= scriptsDir %>constants/**/*.js',
                    '<%= scriptsDir %>a9/A9.js',
                    '<%= scriptsDir %>a9/helpers/**/*.js',
                    '<%= scriptsDir %>a9/UIComponents/**/*.js',
                    //'<%= scriptsDir %>a9/masking/masking.js',
                    //'<%= scriptsDir %>a9/masking/masks/decimal.js',
                    //'<%= scriptsDir %>a9/masking/masks/**/*.js',
                    //'<%= scriptsDir %>a9/masking/**/*.js',
                    '<%= scriptsDir %>a9/validation/validation.js',
                    '<%= scriptsDir %>a9/validation/helpers/**/*.js',
                    '<%= scriptsDir %>a9/validation/microvalidators/**/*.js',
                    '<%= scriptsDir %>a9/validation/validators/dependency/dependency.js',
                    '<%= scriptsDir %>a9/validation/validators/**/*.js',
                    '<%= scriptsDir %>a9/validation/**/*.js',
                    '<%= scriptsDir %>libs/awareness/**/*.js',
                    '<%= scriptsDir %>libs/faith/**/*.js',
                    '<%= scriptsDir %>libs/cnCt/**/*.js',
                    //'<%= scriptsDir %>libs/jmForms/jmForms.js',
                    //'<%= scriptsDir %>libs/jmForms/helpers/**/*.js',
                    //'<%= scriptsDir %>libs/jmForms/commonTmpls/microTmpls.js',
                    //'<%= scriptsDir %>libs/jmForms/commonTmpls/**/*.js',
                    //'<%= scriptsDir %>libs/jmForms/fields/**/*.js',
                    //'<%= scriptsDir %>libs/jmForms/indications/**/*.js',
                    //'<%= scriptsDir %>vostokInternetBank/defined/**/*.js',
                    '<%= scriptsDir %>newVisionProductions/NV.js',
                    '<%= scriptsDir %>newVisionProductions/modules/**/*.js',
                    '<%= scriptsDir %>newVisionProductions/elements/**/*.js',
                    '<%= scriptsDir %>newVisionProductions/**/*.js',
                    '<%= scriptsDir %>init.js'
                ],
                dest: '<%= prodBuildDir %>scripts/main.js'
            },
            css: {
                src: [
                    //'!<%= stylesDir %>_services/**/*.css',
                    '<%= stylesDir %>default.css',
                    //'<%= stylesDir %>ui/default/*.css',
                    //'<%= stylesDir %>ui/**/*.css',
                    '<%= stylesDir %>blocks/**/*.css',
                    '<%= stylesDir %>layout/*.css',
                    '<%= stylesDir %>pages/*.css'

                ],
                dest: '<%= prodBuildDir %>styles/main.css'
            }

        },
        replace:{
            cssFixURLs: {
                src: '<%= prodBuildDir %>styles/main.css',
                dest: '<%= prodBuildDir %>styles/main.css',
                replacements: [
                    {
                        from: /(\.\.\/){2,}/g,
                        to: '../'
                    }
                ]
            }
        },
        cssmin:{
            all: {
                files: {
                    '<%= prodBuildDir %>styles/main.min.css': ['<%= prodBuildDir %>styles/main.css']
                }
            }
        },
        uglify:{
            all: {
                files: {
                    '<%= prodBuildDir %>scripts/main.min.js': ['<%= prodBuildDir %>scripts/main.js']
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-script-link-tags');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.registerTask('default',
        [
            'copy:htmlDevSource',
            'tags:buildDevScripts',
            'tags:buildDevLinks',
            'includes:dev',
            'clean:dev'
        ]);
    grunt.registerTask('prod',
        [
            'concat',
            'replace:cssFixURLs',
            'cssmin',
            'uglify',
            'copy:images',
            'copy:data',
            'copy:fonts',
            'copy:htmlSource',
            'copy:vendorScripts',
            'copy:vendorStyles',
            'tags:buildScripts',
            'tags:buildLinks',
            'includes:prod',
            'clean:prod'
        ]);
};