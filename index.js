// Cloudinary Uploader

const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const loggy = require("loggy");
const plur = require("plur");
const prettyBytes = require("pretty-bytes");

// Set default Cloudinary configuration
const cloudinaryPattern = /\.(gif|jpg|jpe|jpeg|png|webp|bmp|ps|ept|eps|pdf|psd|arw|cr2|svg|tif|tiff|webp)$/;
const cloudinaryUseFilename = true;
const cloudinaryUniqueFilename = false;
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
      loggy.info(`[cloudinary] configured for cloud ${auth.cloudName}`);
    } else {
      const cloudName = process.env.CLOUDINARY_URL.split("@").slice(-1)[0];
      loggy.info(`[cloudinary] configured for cloud ${cloudName}`);
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
            },
            function(error, result) {
              newBytes += result.bytes;
              error ? reject(error) : resolve(result);
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
          `[cloudinary] uploaded ${promises.length} ${plur(
            "image",
            promises.length
          )} and saved ${saved} in ${elapsed} sec`
        );
      })
      .catch(err => {
        loggy.error("[cloudinary] error while uploading images:", err.message);
      });
  }

  optimize() {}
};

exports.prototype.brunchPlugin = true;
