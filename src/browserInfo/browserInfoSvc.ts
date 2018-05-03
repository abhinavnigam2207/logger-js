
export function browserInfoSvc ($window, $document) {
        'ngInject';
        
        const osList = [
                {name: 'Windows 95', regex: /(Windows 95|Win95|Windows_95)/},
                {name: 'Windows ME', regex: /(Win 9x 4.90|Windows ME)/},
                {name: 'Windows 98', regex: /(Windows 98|Win98)/},
                {name: 'Windows 2000', regex: /(Windows NT 5.0|Windows 2000)/},
                {name: 'Windows XP', regex: /(Windows NT 5.1|Windows XP)/},
                {name: 'Windows Server 2003', regex: /Windows NT 5.2/},
                {name: 'Windows Vista', regex: /Windows NT 6.0/},
                {name: 'Windows 7', regex: /(Windows 7|Windows NT 6.1)/},
                {name: 'Windows 8.1', regex: /(Windows 8.1|Windows NT 6.3)/},
                {name: 'Windows 8', regex: /(Windows 8|Windows NT 6.2)/},
                {name: 'Windows NT 4.0', regex: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
                {name: 'Windows ME', regex: /Windows ME/},
                {name: 'Android', regex: /Android/},
                {name: 'Open BSD', regex: /OpenBSD/},
                {name: 'Free BSD', regex: /FreeBSD/},
                {name: 'Sun OS', regex: /SunOS/},
                {name: 'Ubuntu', regex: /Ubuntu/},
                {name: 'Linux', regex: /(Linux|X11)/},
                {name: 'iOS', regex: /(iPhone|iPad|iPod)/},
                {name: 'Mac OS X', regex: /Mac OS X/},
                {name: 'Mac OS', regex: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
                {name: 'QNX', regex: /QNX/},
                {name: 'UNIX', regex: /UNIX/},
                {name: 'BeOS', regex: /BeOS/},
                {name: 'OS/2', regex: /OS\/2/},
                {name: 'Search Bot', regex: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        
        let getOSName = function () {
                for (var key in osList) {
                        if (osList.hasOwnProperty(key)) {
                                var os = osList[key];
                                
                                if (os.regex.test($window.navigator.userAgent)) {
                                        return os.name;
                                }
                        }
                }
        };
        
        let getOSVersion = function (osName) {
                switch (osName) {
                        case 'Mac OS X':
                        return getMacOSVersion();
                        case 'Android':
                        return getAndroidOSVersion();
                        case 'iOS':
                        return getIOSVersion();
                        case 'Ubuntu':
                        return getUbuntuOSVersion();
                }
        };
        
        let getMacOSVersion = function () {
                var version = /Mac OS X (10[\._\d]+)/.exec($window.navigator.userAgent);
                
                if (version) {
                        return version[1].replace(/_/g, '.');
                }
        };
        
        let getAndroidOSVersion = function () {
                var version = /Android ([\._\d]+)/.exec($window.navigator.userAgent);
                
                if (version) {
                        return version[1];
                }
        };
        
        let getIOSVersion = function () {
                var version = /OS (\d+)_(\d+)_?(\d+)?/.exec($window.navigator.appVersion);
                
                if (version) {
                        return version[1] + '.' + version[2];
                }
        };
        
        let getUbuntuOSVersion = function () {
                var version = /Ubuntu\/([\._\d]+)/.exec($window.navigator.userAgent);
                
                if (version) {
                        return version[1];
                }
        };
        
        let getOperaInfo = function () {
                return {
                        name: 'Opera',
                        version: $window.navigator.userAgent.indexOf('Version') !== -1 ? getBrowserVersion('Version', 8)
                        : getBrowserVersion('Opera', 6)
                };
        };
        
        let getIEInfo = function () {
                return {
                        name: 'Microsoft Internet Explorer',
                        version: getBrowserVersion('MSIE', 5)
                };
        };
        
        let getChromeInfo = function () {
                return {
                        name: 'Chrome',
                        version: getBrowserVersion('Chrome', 7)
                };
        };
        
        let getSafariInfo = function () {
                return {
                        name: 'Safari',
                        version: $window.navigator.userAgent.indexOf('Version') !== -1 ? getBrowserVersion('Version', 8)
                        : getBrowserVersion('Safari', 7)
                };
        };
        
        let getFirefoxInfo = function () {
                return {
                        name: 'Firefox',
                        version: getBrowserVersion('Firefox', 8)
                };
        };
        
        let getNewerIEInfo = function () {
                return {
                        name: 'Microsoft Internet Explorer',
                        version: $window.navigator.userAgent.substring($window.navigator.userAgent.indexOf('rv:') + 3)
                };
        };
        
        let getUnknownBrowserInfo = function () {
                return {
                        name: undefined,
                        version: undefined
                };
        };
        
        let getBrowserVersion = function (browser, offset) {
                return $window.navigator.userAgent.substring($window.navigator.userAgent.indexOf(browser) + offset);
        };
        
        let trimVersion = function (version) {
                var index;
                
                if ((index = version.indexOf(')')) !== -1) {
                        version = version.substring(0, index);
                }
                if ((index = version.indexOf(';')) !== -1) {
                        version = version.substring(0, index);
                }
                if ((index = version.indexOf(' ')) !== -1) {
                        version = version.substring(0, index);
                }
                return version;
        };
        
        
        const giveMeAllYouGot = function () {
                return {
                        screenSize: this.getScreenSize(),
                        windowSize: this.getWindowSize(),
                        mobile: this.isMobile(),
                        cookiesEnabled: this.areCookiesEnabled(),
                        language: this.getLanguage(),
                        os: this.getOSInfo(),
                        browser: this.getBrowserInfo()
                };
        };
        
        const getScreenSize = function () {
                return {
                        width: screen.width,
                        height: screen.height
                };
        };
        
        const getWindowSize = function () {
                return {
                        width: $window.innerWidth,
                        height: $window.innerHeight
                };
        };
        
        const isMobile = function () {
                return /Mobile|Android|iP(ad|od|hone)|Fennec|mini/.test($window.navigator.userAgent);
        };
        
        const areCookiesEnabled = function () {
                var cookieEnabled = $window.navigator.cookieEnabled;
                
                if (typeof cookieEnabled === 'undefined') {
                        $document.cookie = 'test-cookie';
                        return $document.cookie.indexOf('test-cookie') !== -1;
                }
                return cookieEnabled;
        };
        
        const getLanguage = function () {
                return $window.navigator.language || $window.navigator.userLanguage;
        };
        
        const getOSInfo = function () {
                var osName = getOSName();
                
                if (/Windows/.test(osName)) {
                        return {
                                name: 'Windows',
                                version: /Windows (.*)/.exec(osName)[1]
                        };
                }
                return {
                        name: osName,
                        version: getOSVersion(osName)
                };
        };
        
        const getBrowserInfo = function () {
                var userAgent = $window.navigator.userAgent;
                var browser;
                
                if (/Opera/.test(userAgent)) {
                        browser = getOperaInfo();
                } else if (/MSIE/.test(userAgent)) {
                        browser = getIEInfo();
                } else if (/Chrome/.test(userAgent)) {
                        browser = getChromeInfo();
                } else if (/Safari/.test(userAgent)) {
                        browser = getSafariInfo();
                } else if (/Firefox/.test(userAgent)) {
                        browser = getFirefoxInfo();
                } else if (/Trident\//.test(userAgent)) {
                        browser = getNewerIEInfo();
                } else {
                        browser = getUnknownBrowserInfo();
                }
                browser.version = trimVersion(browser.version);
                
                return browser;
        };
        
        let service = {
                giveMeAllYouGot : giveMeAllYouGot,
                getScreenSize : getScreenSize,
                getWindowSize : getWindowSize,
                isMobile : isMobile,
                areCookiesEnabled : areCookiesEnabled,
                getLanguage : getLanguage,
                getOSInfo : getOSInfo,
                getBrowserInfo : getBrowserInfo
        };
        
        return service;
}