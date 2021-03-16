// Cloudinary Uploader

const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const loggy = require("loggy");
const plur = require("plur");
const prettyBytes = require("pretty-bytes");

// Set default configurations for Cloudinary
const cloudinaryPattern = /\.(gif|jpg|jpe|jpeg|png|webp|bmp|ps|ept|eps|pdf|psd|arw|cr2|svg|tif|tiff|webp)$/;
const cloudinaryUseFilename = false;
const cloudinaryUniqueFilename = true;
const cloudinaryOverwrite = true;

exports = module.exports = class {
  constructor(config) {
    this.config = config.plugins.cloudinary || {};

    if (this.config.auth) {
      auth = {
        cloud_name: this.config.auth.cloudName,
        api_key: this.config.auth.apiKey,
        api_secret: this.config.auth.apiSecret
      };

      cloudinary.config(auth);
    }

    this.config = Object.assign(
      {
        pattern: cloudinaryPattern,
        useFilename: cloudinaryUseFilename,
        uniqueFilename: cloudinaryUniqueFilename,
        overwrite: cloudinaryOverwrite,
        invalidate: cloudinaryOverwrite,
        transforms: []
      },
      this.config
    );

    this.config.pattern = new RegExp(this.config.pattern);
  }

  onCompile(err, assets) {
    let startTime = Date.now();
    let promises = [];
    let oldBytes = 0;
    let newBytes = 0;

    for (let asset of assets) {
      if (!this.config.pattern.test(asset.destinationPath)) {
        continue;
      }

      promises.push(
        new Promise((resolve, reject) => {
          let data = Buffer.from(asset.compiled);
          oldBytes += data.length;

          cloudinary.uploader.upload(
            asset.path,
            {
              resource_type: "image",
              folder: this.config.folder,
              use_filename: this.config.useFilename,
              unique_filename: this.config.uniqueFilename,
              overwrite: this.config.overwrite
              // notification_url: "https://mysite.example.com/notify_endpoint"
            },
            function(error, result) {
              console.log(result, error);
              newBytes += result.bytes;
            }
          );
        })
      );
    }

    Promise.all(promises)
      .then(() => {
        let elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        let saved = prettyBytes(oldBytes - newBytes);

        loggy.info(
          `uploaded ${promises.length} ${plur(
            "image",
            promises.length
          )} to save ${saved} in ${elapsed} sec`
        );
      })
      .catch(err => {
        loggy.error("Image cloudinary upload failed due to", err.message);
      });
  }

  // Call javascript to optimize the file
  optimize() {}
};

// Classify the plugin as a brunchPlugin
exports.prototype.brunchPlugin = true;
