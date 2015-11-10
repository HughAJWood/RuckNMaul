var Ruck = {};
Ruck.N = {};
Ruck.N.Maul = (function () {
    // todo: replace basesite with app config
    var tenant = 'akdhackathon.sharepoint.com';
    var baseSite = 'https://' + tenant;
    var _private = {
        endpoints: {
            filesResource: baseSite
        },
        authContext: (function() {
            var config = {
                tenant: tenant,
                clientId: 'f9907fb7-76e0-498d-85fe-a41ba41482b4',
                postLogoutRedirectUri: window.location.origin,
                endpoints: endpoints,
                cacheLocation: 'localStorage'
            };
            return new AuthenticationContext(config);
        }),
        userId: (function() {
            // todo: generate userId for assigned to in tasks
        })(),
        emailAddress: (function() {
            // todo: get email address from outlook
        }),
        calculateStart: function(dueDate, length) {
            var startDate = dueDate;
            var daysLength = (length / 7);
            // todo: calculate weekends
            startDate.setDate(startDate.getDate() - daysLength);
            return startDate;
        },
        calculatePriority: function (value, length) {
            // todo: calculate realistic data
            var coefficient = cost / length;
            if (coefficient < 200) return 1;
            if (coefficient > 1000) return 3;
            return 2;
        }
    };

    // Handle redirects before program init
    var isCallback = authContext.isCallback(window.location.hash);
    _private.authContext.handleWindowCallback();
    Console.log(authContext.getLoginError());

    if (isCallback && !authContext.getLoginError()) {
        window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
    }

    var _public = {
        SendTask: function(title, dueDate, length, cost, value, description) {
            var due = new Date();
            due.setDate(due.getDate() + 7);
            

            // If no user then login
            if (!authContext.getCachedUser()) {
                _private.authContext.login();
            }

            var call = jQuery.ajax({
                url: baseSite + "/sites/hackathon/_api/Web/Lists/getByTitle('RuckNMaul')/Items",
                type: "POST",
                data: JSON.stringify({
                    "__metadata": { type: "SP.Data.TasksListItem" },
                    Title: title,
                    AssignedToId: _private.userId,
                    StartDate: _private.calculateStart(dueDate, length),
                    DueDate: dueDate,
                    Description: description,
                    Cost: cost,
                    Value: value,
                    Priority: _private.calculatePriority(value, length)
                }),
                headers: {
                    // todo: add authorisation
                    Accept: "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose",
                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
                }
            });
            call.done(function (data, textStatus, jqXHR) {
                var div = jQuery("#message");
                div.text("Item added");
            });
            call.fail(function (jqXHR, textStatus, errorThrown) {
                failHandler(jqXHR, textStatus, errorThrown);
            });
        }
    };
    return _public;
})();

