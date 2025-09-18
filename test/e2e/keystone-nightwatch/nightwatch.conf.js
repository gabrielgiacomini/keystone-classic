var fs = require('fs');
var path = require('path');

function firstExistingPath (paths) {
        for (var i = 0; i < paths.length; i++) {
                if (paths[i] && fs.existsSync(paths[i])) {
                        return paths[i];
                }
        }
        return null;
}

function resolveFromEnv (keys) {
        for (var i = 0; i < keys.length; i++) {
                var value = process.env[keys[i]];
                if (value && fs.existsSync(value)) {
                        return value;
                }
        }
        return null;
}

function inferChromePlatform (isWindows) {
        if (process.env.KNE_CHROMEDRIVER_PLATFORM) {
                return process.env.KNE_CHROMEDRIVER_PLATFORM;
        }

        if (isWindows) {
                return 'win32';
        }

        if (process.platform === 'darwin') {
                return 'mac32';
        }

        if (process.platform === 'linux') {
                return process.arch === 'ia32' ? 'linux32' : 'linux64';
        }

        return null;
}

function usingChrome (envName) {
        return envName === 'default' || /^chrome/.test(envName || '');
}

module.exports = (function (settings) {
        var isWindows = /^win/.test(process.platform);
        var driverRoot = process.env.KNE_DRIVER_ROOT || path.resolve(__dirname, '../drivers');
        var chromeDriver = resolveFromEnv(['KNE_CHROMEDRIVER_PATH', 'CHROMEDRIVER_PATH']);
        var geckoDriver = resolveFromEnv(['KNE_GECKODRIVER_PATH', 'GECKODRIVER_PATH']);

        if (!chromeDriver) {
                var chromeBinary = isWindows ? 'chromedriver.exe' : 'chromedriver';
                var chromePlatform = inferChromePlatform(isWindows);
                var chromeCandidates = [];

                if (chromePlatform) {
                        chromeCandidates.push(path.join(driverRoot, 'chrome', chromePlatform, chromeBinary));
                }

                chromeCandidates.push(path.join(driverRoot, 'chrome', 'linux64', chromeBinary));
                chromeCandidates.push(path.join(driverRoot, 'chrome', 'linux32', chromeBinary));
                chromeCandidates.push(path.join(driverRoot, 'chrome', 'mac32', chromeBinary));
                chromeCandidates.push(path.join(driverRoot, 'chrome', 'win32', chromeBinary));

                chromeDriver = firstExistingPath(chromeCandidates);
        }

        if (!geckoDriver) {
                try {
                        var geckoDriverPath = require.resolve('geckodriver');
                        geckoDriver = isWindows
                                ? path.join(geckoDriverPath, '../..', 'geckodriver.exe')
                                : path.join(geckoDriverPath, '../..', 'geckodriver');
                } catch (geckoErr) {
                        geckoDriver = null;
                }
        }

        // The following environment variables are set to comma separated strings in index.js
        // Here we will convert them to an array, as required by nightwatch.
        settings.src_folders = process.env.KNE_TEST_PATHS.split(',');
        settings.page_objects_path = process.env.KNE_PAGE_OBJECT_PATHS.split(',');
        settings.test_settings.default.exclude = process.env.KNE_EXCLUDE_TEST_PATHS.split(',');

        settings.globals_path = path.resolve(__dirname, 'globals.js');
        if (chromeDriver) {
                settings.selenium.cli_args['webdriver.chrome.driver'] = chromeDriver;
        } else if (usingChrome(process.env.KNE_TEST_ENV)) {
                throw new Error('kne: Unable to locate chromedriver. Set KNE_CHROMEDRIVER_PATH or place the binary under ' + path.join(driverRoot, 'chrome'));
        } else {
                delete settings.selenium.cli_args['webdriver.chrome.driver'];
        }

        if (geckoDriver) {
                settings.selenium.cli_args['webdriver.gecko.driver'] = geckoDriver;
        } else {
                delete settings.selenium.cli_args['webdriver.gecko.driver'];
        }

        if (process.env.KNE_BROWSER_NAME) {
                settings.test_settings[process.env.KNE_TEST_ENV].desiredCapabilities.browserName = process.env.KNE_BROWSER_NAME;
        }

	if (process.env.KNE_BROWSER_VERSION) {
		settings.test_settings[process.env.KNE_TEST_ENV].desiredCapabilities.version = process.env.KNE_BROWSER_VERSION;
	}

	console.log('nightwatch settings:'
		+ '\n\tNightwatch Environment: ' + process.env.KNE_TEST_ENV
		+ '\n\tNightwatch Start Selenium: ' + process.env.KNE_SELENIUM_START_PROCESS
		+ '\n\tBrowser Name: ' + settings.test_settings[process.env.KNE_TEST_ENV].desiredCapabilities.browserName
		+ '\n\tBrowser Version: ' + settings.test_settings[process.env.KNE_TEST_ENV].desiredCapabilities.version
		+ '\n\tSauceLabs Tunnel Id: ' + process.env.TRAVIS_JOB_NUMBER
		+ '\n\tChromeDriver: ' + settings.selenium.cli_args['webdriver.chrome.driver']
		+ '\n\tgeckoDriver: ' + settings.selenium.cli_args['webdriver.gecko.driver']
	);

	return settings;

})(require('./nightwatch.json'));
