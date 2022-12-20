module.exports = {
  packagerConfig: {
    icon: 'view/img/favicon.ico' // no file extension required
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Midrooms',
        description: 'CrepePlus',
        setupIcon: __dirname + "/view/img/favicon.ico"
      }
    },
    {
      name: "@electron-forge/maker-zip"
    }
  ],
};
