var Ruck = {};
Ruck.N = {};
Ruck.N.Maul = (function () {
    // todo: replace basesite with app config
    var tenant = "n8design.sharepoint.com";
    var baseSite = "https://" + tenant;
    var authToken;
    (function() {
        var authContext = new O365Auth.Context();
        authContext.getIdToken(baseSite)
            .then((function(token) {
                authToken = token;
                console.log("Token:" + token);
            }).bind(this), function (reason) {
                console.log('Failed to login. Error = ' + reason.message);
            });
        // todo: handle retry
    }());
    var myPrivate = {
        endpoints: {
            filesResource: baseSite
        },
        userId: (function() {
            // todo: generate userId for assigned to in tasks
        }()),
        emailAddress: (function() {
            // todo: get email address from outlook
        }()),
        calculateStart: function(dueDate, length) {
            var startDate = dueDate;
            var daysLength = (length / 7);
            // todo: calculate weekends
            startDate.setDate(startDate.getDate() - daysLength);
            return startDate;
        },
        calculatePriority: function (value, length) {
            // todo: calculate realistic data
            var coefficient = value / length;
            if (coefficient < 200) return 1;
            if (coefficient > 1000) return 3;
            return 2;
        }
    };

    var myPublic = {
        SendTask: function(title, dueDate, length, cost, value, description) {
            var due = new Date();
            due.setDate(due.getDate() + 7);
            
            var call = jQuery.ajax({
                url: baseSite + "/sites/hackathon/_api/Web/Lists/getByTitle('HuckNMaul')/Items",
                type: "POST",
                data: JSON.stringify({
                    "__metadata": { type: "SP.Data.TasksListItem" },
                    Title: title,
                    AssignedToId: myPrivate.userId,
                    StartDate: myPrivate.calculateStart(dueDate, length),
                    DueDate: dueDate,
                    Description: description,
                    Cost: cost,
                    Value: value,
                    Priority: myPrivate.calculatePriority(value, length)
                }),
                headers: {
                    Authorization: "bearer" + authToken,
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
    return myPublic;
})();

