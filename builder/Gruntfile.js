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
        stylesDir: publicDir + 'styles/',
        copy:{
            htmlDevSource:{
                expand: true,
                cwd: '<%= sourceDir %>',
                src: ['**/*.html'],
                dest: '<%= publicDir %>'
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
                    //'<%= scriptsDir %>a9/A9.js',
                    //'<%= scriptsDir %>a9/helpers/**/*.js',
                    //'<%= scriptsDir %>a9/UIComponents/**/*.js',
                    //'<%= scriptsDir %>a9/masking/masking.js',
                    //'<%= scriptsDir %>a9/masking/masks/decimal.js',
                    //'<%= scriptsDir %>a9/masking/masks/**/*.js',
                    //'<%= scriptsDir %>a9/masking/**/*.js',
                    //'<%= scriptsDir %>a9/validation/validation.js',
                    //'<%= scriptsDir %>a9/validation/helpers/**/*.js',
                    //'<%= scriptsDir %>a9/validation/microvalidators/**/*.js',
                    //'<%= scriptsDir %>a9/validation/validators/dependency/dependency.js',
                    //'<%= scriptsDir %>a9/validation/validators/**/*.js',
                    //'<%= scriptsDir %>a9/validation/**/*.js',
                    //'<%= scriptsDir %>libs/awareness/**/*.js',
                    //'<%= scriptsDir %>libs/faith/**/*.js',
                    //'<%= scriptsDir %>libs/cnCt/**/*.js',
                    //'<%= scriptsDir %>libs/jmForms/jmForms.js',
                    //'<%= scriptsDir %>libs/jmForms/helpers/**/*.js',
                    //'<%= scriptsDir %>libs/jmForms/commonTmpls/microTmpls.js',
                    //'<%= scriptsDir %>libs/jmForms/commonTmpls/**/*.js',
                    //'<%= scriptsDir %>libs/jmForms/fields/**/*.js',
                    //'<%= scriptsDir %>libs/jmForms/indications/**/*.js',
                    //'<%= scriptsDir %>vostokInternetBank/defined/**/*.js',
                    //'<%= scriptsDir %>vostokInternetBank/VIB.js',
                    //'<%= scriptsDir %>vostokInternetBank/modules/**/*.js',
                    //'<%= scriptsDir %>vostokInternetBank/elements/**/*.js',
                    //'<%= scriptsDir %>vostokInternetBank/**/*.js',
                    '<%= scriptsDir %>vendor/*.js',
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
                    //'<%= stylesDir %>default.css',
                    //'<%= stylesDir %>ui/default/*.css',
                    //'<%= stylesDir %>ui/**/*.css',
                    //'<%= stylesDir %>blocks/**/*.css',
                    //'<%= stylesDir %>pages/*.css',
                    //'<%= stylesDir %>layout/*.css'
                    //'<%= stylesDir %>fonts/*.css',
                    '<%= stylesDir %>*.css'
                ],
                dest: '<%= publicDir %>includes/styles.html'
            }
        },
        clean:{
            dev: {
                options: { force: true },
                src: ['<%= publicDir %>includes']
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-script-link-tags');


    grunt.registerTask('default',
        [
            'copy:htmlDevSource',
            'tags:buildDevScripts',
            'tags:buildDevLinks',
            'includes:dev'//,
            //'clean:dev'
        ]);
    grunt.registerTask('prod',[]);
};