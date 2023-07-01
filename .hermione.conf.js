module.exports = {
  sets: {
    desktop: {
      files: "test/hermione",
      browsers: ['chrome']
    },
  },

  browsers: {
    chrome: {
      automationProtocol: "devtools",
      desiredCapabilities: {
        browserName: "chrome",
      },
    },
  },
  plugins: {
    "html-reporter/hermione": {
      enabled: true,
      path: 'hermione-html-reports',
    },
  },
};
