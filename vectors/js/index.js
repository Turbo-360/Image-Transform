/* Define your vectors here. To run the samples, uncomment the functions
   below then from the root directory, run the devserver:
   $ turbo devserver

   then navigate to: 
   http://localhost:3000/vectors/sample

   Deploy the vectors by running from root directory:
   $ turbo vectors
*/

// import npm packages here:
// var turbo = require('turbo360')
var screenshot = require('url-to-image')
var superagent = require('superagent')
var Promise = require('bluebird')
var imagemin = require('imagemin')
var imageminJpegoptim = require('imagemin-jpegoptim')
var imageminPngquant = require('imagemin-pngquant')

var httpRequest = function(url, query){
	return new Promise(function(resolve, reject){
		superagent.get(url)
		.query(query)
		.end((err, res) => {
			if (err){ 
				reject(err)
				return
			}

			var payload = res.text || res.body
			resolve(payload)
		})
	})
}


module.exports = {

	/*
	compress: (req, res) => {
		const url = req.query.url
		if (url == null){
			res.json({
				confirmation: 'fail',
				message: 'Missing url parameter'
			})
			return
		}

		let fileData = null
		let format = 'html'
		httpRequest(url)
		.then(payload => {
			if (payload == null){
				throw new Error('Missing File Data')
				return
			}

			return imagemin.buffer(payload, {
				plugins: [imageminJpegoptim({max:30}), imageminPngquant({quality:'65'})]
			})
		})
		.then(data => {
			fileData = data
			res.send(data)
			// return httpRequest('https://media-service.appspot.com/api/upload')
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
	},
	*/

	transform: (req, res) => {
		// var url = 'https://news.ycombinator.com/'
		// var url = 'https://i.redd.it/ljm5se1d0coz.jpg'

		const url = req.query.url
		if (url == null){
			res.json({
				confirmation: 'fail',
				message: 'Missing url parameter'
			})
			return
		}

		const format = req.query.format || 'html' // html or json


		let fileData = null
		httpRequest(url)
		.then(payload => {
			if (payload == null){
				throw new Error('Missing File Data')
				return
			}

			// res.send(payload)
			fileData = payload
			return httpRequest('https://media-service.appspot.com/api/upload')
		})
		.then(payload => {
			const json = JSON.parse(payload)
			const upload = json.upload

			const parts = url.split('/')
			let filename = parts[parts.length-1]
			if (filename.length == 1)
				filename = 'test.jpg'

			var uploadRequest = superagent.post(upload)
			uploadRequest.attach('file', fileData, filename)

			uploadRequest.end((err, resp) => {
				if (err){
					console.log('UPLOAD ERROR: '+JSON.stringify(err))
					res.json({
						confirmation: 'fail',
						message: err
					})
					return
				}

				const image = resp.body.image
				const address = image.address

				if (format == 'html'){
					let html = '<html><h2>Original</h2><img src="'+address+'" />'
					html += '<h3>Scaled</h3><img src="'+address+'=s160" />'
					html += '<h4>Thumbnail</h4><img src="'+address+'=s64-c" />'
					res.send(html)
					return
				}

				res.json({
					confirmation: 'success',
					formatted: {
						original: address,
						scaled: address+'=s160',
						thumbnail: address+'=s64-c'
					}
				})
	        })

			return
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
	}

}