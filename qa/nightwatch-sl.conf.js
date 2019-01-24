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
        'chrome-1_W10': {
            desiredCapabilities: {
                platform: 'Windows 10',
                browserName: 'chrome',
                version: 'latest-1'
            }
        },
        'chrome-2_W10': {
            desiredCapabilities: {
                platform: 'Windows 10',
                browserName: 'chrome',
                version: 'latest-2'
            }
        },
        'chrome_W8': {
            desiredCapabilities: {
                platform: 'Windows 8.1',
                browserName: 'chrome',
                version: 'latest'
            }
        },
        'chrome-1_W8': {
            desiredCapabilities: {
                platform: 'Windows 8.1',
                browserName: 'chrome',
                version: 'latest-1'
            }
        },
        'chrome-2_W8': {
            desiredCapabilities: {
                platform: 'Windows 8.1',
                browserName: 'chrome',
                version: 'latest-2'
            }
        },
        'chrome_W7': {
            desiredCapabilities: {
                platform: 'Windows 7',
                browserName: 'chrome',
                version: 'latest'
            }
        },
        'chrome-1_W7': {
            desiredCapabilities: {
                platform: 'Windows 7',
                browserName: 'chrome',
                version: 'latest-1'
            }
        },
        'chrome-2_W7': {
            desiredCapabilities: {
                platform: 'Windows 7',
                browserName: 'chrome',
                version: 'latest-2'
            }
        },
        edge: {
            desiredCapabilities: {
                browserName: 'MicrosoftEdge',
                version: 'latest'
            }
        },
        'edge-1': {
            desiredCapabilities: {
                browserName: 'MicrosoftEdge',
                version: 'latest-1'
            }
        },
        'edge-2': {
            desiredCapabilities: {
                browserName: 'MicrosoftEdge',
                version: 'latest-2'
            }
        },
        ie_W10: {
            desiredCapabilities: {
                platform: 'Windows 10',
                browserName: 'internet explorer'
            }
        },
        ie_W8: {
            desiredCapabilities: {
                platform: 'Windows 8.1',
                browserName: 'internet explorer'
            }
        },
        ie_W7: {
            desiredCapabilities: {
                platform: 'Windows 7',
                browserName: 'internet explorer'
            }
        },
        firefox: {
            desiredCapabilities: {
                browserName: 'firefox',
                marionette: true
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
        },
        galaxy_s9_plus_fhd: {
            desiredCapabilities: {
                appiumVersion: '1.9.1',
                deviceName: 'Samsung Galaxy S9 Plus FHD GoogleAPI Emulator',
                deviceOrientation: 'portrait',
                browserName: 'chrome',
                platformVersion: '8.0',
                platformName: 'Android'
            }
        }
    }
};
