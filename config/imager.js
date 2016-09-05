module.exports = {
  variants: {
    article: {
      resize: {
        detail: "x440"
      },
      crop: {
        thumb: "16000@"
      },
      resizeAndCrop: {
        mini: {resize: "63504@", crop: "252x210"}
      }
    },

    gallery: {
      crop: {
        thumb: "100x100"
      }
    }
  },

  storage: {
    Rackspace: {
      auth: {
        username: "USERNAME",
        apiKey: "API_KEY",
        host: "lon.auth.api.rackspacecloud.com"
      },
      container: "CONTAINER_NAME"
    },
    S3: {
      key: 'API_KEY',
      secret: 'SECRET',
      bucket: 'BUCKET_NAME',
      region: 'REGION'
    }
  },

  debug: true
}
