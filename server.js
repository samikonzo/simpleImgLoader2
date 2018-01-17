global.l 		= console.log
const express 	= require('express')
const app 		= express()
const path 		= require('path')
const fs 		= require('fs')
const reload 	= require('reload')

/*
* browser reloader
*/
reload(app)

/*
* images extensions
*/
const imageExtension = {
	'.png' : true,
	'.svg' : true,
	'.jpg' : true,
	'.jpeg': true
}

app.use(express.static('./src'))

app.get('/?images=:category', (req, res) => {
	l(req.params.category)

	var filesUrls = []

	fs.readdir('./src/images/' + req.params.category, (err, files) => {
		files.forEach(fileName => {
			var ext = path.extname(fileName)
			//l(ext, ' - ', imageExtension[ext])
			if(imageExtension[ext]) filesUrls.push('/images/'+ req.params.category + '/' + fileName)
		})

		//l('length : ', filesUrls.length)

		if(filesUrls.length){
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Cache-Control', 'private')
			res.end(
				JSON.stringify(filesUrls)
			)
		} else {
			res.end('')
		}
	})


})

app.listen(3000)