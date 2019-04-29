using System.Linq;
using Umbraco.Core;
using Umbraco.Web;
using Umbraco.Web.Trees;

namespace tooorangey.RumDo.App_Start
{
    public class RegisterEvents : ApplicationEventHandler
    {
        protected override void ApplicationStarting(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            //register custom menu item in the media tree
            //turn off/on via config setting?
            TreeControllerBase.MenuRendering += TreeControllerBase_MenuRendering;
        }

        private void TreeControllerBase_MenuRendering(TreeControllerBase sender, MenuRenderingEventArgs e)
        {
            if (sender.TreeAlias == "content")
            {
                var umbracoHelper = new UmbracoHelper(UmbracoContext.Current);
                var nodeId = e.NodeId;
                var contentItem = umbracoHelper.TypedContent(nodeId);
                var blackListDocTypes = new string[] { "redirectPage" };
                if (contentItem != null && !blackListDocTypes.Contains(contentItem.DocumentTypeAlias))
                {
                    var redirectsMenuItem = new Umbraco.Web.Models.Trees.MenuItem("viewRedirects", "Manage Redirects");
                    redirectsMenuItem.Icon = "reply-arrow";
                    redirectsMenuItem.SeperatorBefore = true;
                    redirectsMenuItem.AdditionalData.Add("actionView", "/app_plugins/tooorangey.RumDo/ManageRedirectsActionMenu.html");
                    var menuPosition = e.Menu.Items.Count > 9 ? 10 : e.Menu.Items.Count - 1;
                    e.Menu.Items.Insert(menuPosition, redirectsMenuItem);
                }
            }
        }

    }
}