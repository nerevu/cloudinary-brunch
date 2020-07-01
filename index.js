// Cloudinary Uploader

// Import packages
const fs = require('fs')
const cloudinary = require('cloudinary')
const loggy = require('loggy')
const plur = require('plur')
const prettyBytes = require('pretty-bytes')

// Set default configurations for Cloudinary
const cloudinaryPattern = /\.(gif|jpg|jpeg|jpe|jif|jfif|jfi|png|svg|svgz)$/
const cloudinaryOverwrite = true
const cloudinaryPlugins = {}


// Define the main app behavior
exports = module.exports = class {

	// Configure the method
	constructor(config) {

		// Pass in the configuration
		this.config = config.plugins.cloudinary || {}


		// If new instance does not have plugins, create an empty one (???)
		if(new Object(this.config.plugins) !== this.config.plugins)
			this.config.plugins = {}

		// Pass the imageminPlugin to the app
		this.config.plugins = Object.assign(
			{}, cloudinaryPlugins, this.config.plugins
		)

		// Initialize plugins
		this.plugins = []

		// Iterate through 
		let pluginLoads = 0
		for(let plugin in this.config.plugins) {
			let options = this.config.plugins[plugin]
			if(!options) continue
			else pluginLoads++
			try {
				if(new Object(options) === options)
					this.plugins.push(require(plugin)(options))
				else
					this.plugins.push(require(plugin)())
			} catch(err) {
				loggy.warn(`Loading of ${plugin} failed due to`, err.message)
			}
		}

		if(!('pattern' in this.config)) this.config.pattern = cloudinaryPattern
		this.config.pattern = new RegExp(this.config.pattern)

		if(!('overwrite' in this.config)) this.config.overwrite = cloudinaryOverwrite
	}

	onCompile(err, assets) {
		let startTime = Date.now()
		let promises = []
		let oldBytes = 0
		let newBytes = 0

		for(let asset of assets) {
			if(!this.config.pattern.test(asset.destinationPath)) continue

			promises.push(new Promise((res, rej) => {
				let data = Buffer.from(asset.compiled)
				oldBytes += data.length

				// Call the Cloudinary uploader function
				cloudinary.v2.uploader.upload(data,
					{
						resource_type: "photo",
						public_id: this.config.public_id,
						overwrite: this.config.overwrite,
						// notification_url: "https://mysite.example.com/notify_endpoint"	// ???
					},
					function(error, result) {console.log(result, error)}
				);
			}))
		}

		Promise.all(promises).then(() => {
			let elapsed = ((Date.now() - startTime)/1000).toFixed(1)
			let saved = prettyBytes(oldBytes - newBytes)

			loggy.info(`uploaded ${promises.length} ${plur('image', promises.length)} to save ${saved} in ${elapsed} sec`)
		}).catch(err => {
			loggy.error('Image cloudinary upload failed due to', err.message)
		})
	}

	// Call javascript to optimize the file
	optimize() {}
}

// Classify the plugin as a brunchPlugin
exports.prototype.brunchPlugin = true
