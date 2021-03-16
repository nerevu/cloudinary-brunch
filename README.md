# cloudinary-brunch

Cloudinary support for brunch

This brunch plugin uploads any images to [Cloudinary](https://cloudinary.com/).


## Built-in Asset Collection

This plugin automatically uploads any assets with the following extensions, with no configuration required:

`.gif`, `.jpg`, `.jpe`, `.jpeg`, `.png`, `.webp`, `.bmp`, `.ps`, `.ept`, `.eps`, `.pdf`, `.psd`, `.arw`, `.cr2`, `.svg`, `.tif`, `.tiff`, `.webp`


## Make sure you're in production mode

By default, this plugin will run whenever brunch is in production mode. Any of these commands should work to upload your images:

```
$ brunch b -p
$ brunch build -p
$ brunch b --production
$ brunch build --production
```

If you are using the default skeleton, `npm run build` should also work.

## Configuration

```js
plugins.cloudinary = {
  auth: {},
  folder: null
  useFilename: true
  uniqueFilename: true
  overwrite: true
  transforms: [],
  pattern: /\.(gif|jpg|jpe|jpeg|png|webp|bmp|ps|ept|eps|pdf|psd|arw|cr2|svg|tif|tiff|webp)$/
}
```

See [Cloudinary parameters](https://cloudinary.com/documentation/image_upload_api_reference#upload_optional_parameters) for additional info.

### `auth`

If the `CLOUDINARY_URL` environment variable is not defined, you must configure cloudinary by setting this to an object with the following keys: `cloudName`, `apiKey`, and `apiSecret`.

### `folder`

An optional folder name where the uploaded asset will be stored.

### `useFilename`

Whether to use the original file name of the uploaded asset. When `false`, the Public ID will be comprised of random characters. When `true`, the uploaded file's original filename becomes the Public ID. Random characters are appended to the filename value to ensure Public ID uniqueness if `uniqueFilename` is true.

### `uniqueFilename`

When `false`, does not add random characters at the end of the filename that guarantee its uniqueness. In this case, if `overwrite` is also `false`, the upload returns an error. This parameter is relevant only if `useFilename` is also `true`.

### `overwrite`

Whether to overwrite existing assets with the same Public ID. When set to false, a response is returned immediately if an asset with the same Public ID was found.

### `transform`

[Transformations](https://cloudinary.com/documentation/transformation_reference) passed directly to Cloudinary's [`eager`](https://cloudinary.com/documentation/image_upload_api_reference#examples) parameter.

### `pattern`

This is a regular expression pattern used to figure out [which files](https://cloudinary.com/documentation/image_transformations#supported_image_formats) should be uploaded to Cloudinary.
