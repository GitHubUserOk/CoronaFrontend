const { defineConfig } = require('@vue/cli-service')
const fs = require('fs')

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
	https: {
		key: fs.readFileSync('./corona.com+5-key.pem'),
		cert: fs.readFileSync('./corona.com+5.pem')
		}
	}
})
