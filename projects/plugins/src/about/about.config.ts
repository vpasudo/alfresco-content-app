export default {
  $id: 'about',
  $name: 'about',
  $version: '1.0.0',
  $vendor: 'Alfresco',
  $license: 'LGPL',
  $runtime: '1.8.0',

  routes: [
    {
      id: 'plugin.route.1',
      path: 'plugins/about',
      component: 'about#entry'
    }
  ],

  actions: [
    {
      id: 'navigate.plugin.about',
      type: 'NAVIGATE_URL',
      payload: '/plugins/about'
    }
  ],

  features: {
    header: [
      {
        id: 'app.header.more',
        children: [
          {
            id: 'app.plugin.about',
            title: 'APP.BROWSE.ABOUT.TITLE',
            description: 'APP.BROWSE.ABOUT.TITLE',
            icon: 'info',
            actions: {
              click: 'navigate.plugin.about'
            }
          }
        ]
      }
    ]
  }
};
