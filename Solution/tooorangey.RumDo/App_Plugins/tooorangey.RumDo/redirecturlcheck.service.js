angular.module("umbraco.services").factory("redirectUrlCheckService", function () {
    return {
        checkUrl: function (url) {

            url = url.trim();
            var validUrlStatus = {
                isValidUrl: false,
                statusMessage: '',
                url: url
            };
            if (url.length > 0) {
                validUrlStatus.isValidUrl = true;
                // Essentially we're not trying to create a perfect redirection mechnism here to cope with all scenarios
                // mainly this is to help editors avoid having to do the renaming workaround they are currently doing already
                // or if they have accidentally removed a redirect, and they want to reinstate it
                // and of course I'm being unbelievably lazy
                // Warning people might put urls in here that are nonsense!
                // Things considered:
                //if the url is less than three characters it isn't a url?
                if (url.length < 3) {
                    validUrlStatus.statusMessage = "'Url to Redirect From' must be a little longer than maybe 2 chars?";
                    validUrlStatus.isValidUrl = false;
                }
                // only relative urls, like the tracker? or does the tracker add the domain if one is set?
                if (url.startsWith('http')) {
                    validUrlStatus.statusMessage = "'Url to Redirect From' must be relative, and start with a leading /, not http or https";
                    validUrlStatus.isValidUrl = false;
                }
                // basically you must start the url with a slash - be more helpful to just prepend this?
                if (!url.startsWith('/')) {
                    validUrlStatus.statusMessage = "'Url to Redirect From' must be relative, and start with a leading /";
                    validUrlStatus.isValidUrl = false;
                }
                // you can't have any spaces in the url
                if (url.indexOf(' ') >= 0) {
                    validUrlStatus.statusMessage = "'Url to Redirect From' cannot contain whitespace";
                    validUrlStatus.isValidUrl = false;
                }
           
                // Url has a file extension eg /oldpage.asp ?
                // we don't want to use this mechnism for redirect hundreds of old system urls, that's more of a rewrite rule thing, create a static rewrite map if necessary
                // so not really thinking this through but can we safely disallow any url with . in it?
                if (url.indexOf('.') >= 0) {
                    validUrlStatus.statusMessage = "'Url to Redirect From' cannot contain a dot/full stop - this is just for handling simple renames";
                    validUrlStatus.isValidUrl = false;
                }
                     //Other things still to consider...
                // Url contains invalid characters?    
                // Url already exists in dashboard and redirects somewhere else - do we replace the entry already there? or error?
                // need to think about this but:
                // Url is a redirect to itself
                // Url is a redirect to a url which is also a redirect (flag possible circular reference)

                // the core redirectservice is adding a slash on the end, (regardless of  useTrailingSlash value - so we're stripping the trailing slash here...
                if (url.endsWith('/')) {
                    validUrlStatus.url = url.slice(0, -1);
                }

            }

            return validUrlStatus;
        }
    };

});