# tooorangey.RumDo
The Redirect Url Management dashboard in Umbraco tracks changes to published Urls and creates 301 redirects automatically from the old Url to the new Url.

It isn't designed to be a generic 301 redirects solution, and only only redirects triggered by a change in Url get added here.

However I've found editors purposefully renaming pages, in order to generate an appropriate 301 redirect, for a variation of their Url - and I just think if people are going to do that, well, there may as well be a form to add the redirect in manually, which this project provides. You can enter the url to redirect from, and then pick the appropriate Umbraco node to redirect to, just as if you had done the rename trick, nothing more.

The Redirect Url Management dashboard over time can contain alot of links, and when editors come to try and find if a page is being redirected to, the search only searches on the 'Original Url' which often the editor is unaware of, the common question I get asked is, How do I know what alternative Urls are already redirecting to this page? This project adds an Action Menu item on a content node called 'Manage Redirects', so within the context of a certain page in the Umbraco backoffice you can slide out a panel, and see just which redirects exist for a particular page, and you can add or remove them from there.

This isn't an attempt to provide a comprehensive 301 redirect management or tracking solution. It's just to help editors make sense of the existing Umbraco dashboard = it's easier to understand (or perhaps easier to explain) what quite is going on, if you can add a redirect manually, show it appearing, show the 301 redirect happening, and then say, oh and if you rename something that has been published, an entry will automatically appear here...

