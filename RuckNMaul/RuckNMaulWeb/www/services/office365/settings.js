var O365Auth;
// ReSharper disable once InconsistentNaming name references Microsoft Office
(function (O365Auth) {
    (function (Settings) {
        Settings.clientId = 'd38ea2a3-a80e-4ee4-94ea-e044efccc189';
        Settings.authUri = 'https://login.windows.net/common/';
        Settings.redirectUri = 'https://localhost:4400/www/services/office365/redirectTarget.html';
    })(O365Auth.Settings || (O365Auth.Settings = {}));
    var Settings = O365Auth.Settings;
})(O365Auth || (O365Auth = {}));