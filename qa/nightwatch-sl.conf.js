/* eslint-disable */
require('nightwatch-cucumber')({
    cucumberArgs: [
        '--require-module', 'babel-core/register',
        '--require', 'features/step_definitions',
        '--format', 'node_modules/cucumber-pretty',
        '--format', 'json:reports/cucumber.json',
        'features'
    ]
});

module.exports = {
    output_folder: 'reports',
    page_objects_path: 'pages',
    custom_commands_path: 'commands',
    test_workers: {
        enabled: true,
        workers: 'auto' // number of cores used. "auto" means the same number as cores in the cpu
    },
    test_settings: {
        default: {
            launch_url: 'https://arbeidsplassen-t.nav.no/kandidater',
            selenium_port: 4445,
            username: '${SAUCE_USERNAME}',
            access_key: '${SAUCE_ACCESS_KEY}',
            screenshots: {
                enabled: true,
                on_failure: true,
                on_error: true,
                path: './screenshots'
            },
            globals: {
                waitForConditionTimeout: 5000, // sometimes internet is slow so wait.
                environment: 'q6'
            },
            desiredCapabilities: {
                platform: 'Windows 10',
                browserName: 'chrome',
                version: 'latest',
                tunnelIdentifier: 'jenkins-pam-kandidatsok'
            }
        },
        firefox: {
            desiredCapabilities: {
                browserName: 'firefox',
                marionette: true
            }
        },
        edge: {
            desiredCapabilities: {
                browserName: 'MicrosoftEdge'
            }
        },
        ie: {
            desiredCapabilities: {
                browserName: 'internet explorer'
            }
        },
        safari: {
            desiredCapabilities: {
                platform: 'OSX 10.14',
                browserName: 'safari'
            }
        },
        iphone_x: {
            desiredCapabilities: {
                browserName: 'iPhone',
                deviceOrientation: 'portrait',
                deviceName: 'iPhone X',
                platform: 'OSX 10.14',
                version: 'latest'
            }
        }
    }
};
