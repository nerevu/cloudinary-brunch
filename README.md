# cloudinary-brunch
simple image cloudinary uploading for brunch

This brunch plugin uploads any photo assets automatically to [cloudinary](https://cloudinary.com/).


## Built-in Asset Collection
This plugin automatically uploads any assets with the following extensions, with no configuration required:

`.gif` `.jpg` `.jpeg` `.jpe` `.jif` `.jfif` `.jfi` `.png` `.svg` `.svgz`


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
  plugins: {},
  pattern: /\.(gif|jpg|jpeg|jpe|jif|jfif|jfi|png|svg|svgz)$/
}
```

### `plugins`
To enable a new clourinary plugin, create a new key-value pair where the object key is the name of your plugin and give it a truthy value. If you would like to pass options into the plugin, provide an object as your pair's value.

If you want to disable a plugin, add it to this object with a falsy value.

### `pattern`
This is a regular expression pattern used to figure out which files should be passed through to cloudinary for uploading.
