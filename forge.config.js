module.exports = {
  packagerConfig: {
    icon: 'view/favicon.ico' // no file extension required
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip'
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Midrooms',
        description: 'CrepePlus'
      }
    },
  ],
};
