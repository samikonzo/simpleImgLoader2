var l = console.log
var imageContainer = document.querySelector('.imageContainer')
var links = document.getElementsByTagName('a');

document.addEventListener('DOMContentLoaded', function(){
	l('uri : ', location.search)

	l(decodeURIComponent(window.location.hash))

	if(location.search){
		l('?', location.search.split('?')[1])
		var url = location.search.split('?')[1]

		var xhr = new XMLHttpRequest()
		xhr.open('GET', url)

		xhr.send()

		xhr.onload = function(e){
			var images = JSON.parse(this.response)
			showImages(images)
		}
	}
});

[].forEach.call(links, link => {
	link.onclick = function(e){
		e.preventDefault()


		var url = this.getAttribute('href')

		if(location.search && location.search.split('?')[1] == url){
			return
		}

		var xhr = new XMLHttpRequest()
		xhr.open('GET', url)

		xhr.send()

		xhr.onload = function(e){
			var images = JSON.parse(this.response)
			showImages(images)
		}
		history.pushState(null, null, '?' + url);
	}
})

function showImages(array){
	var prevImages = imageContainer.querySelectorAll('img')
	prevImages.forEach(img => {
		img.style.opacity = 0;
		setTimeout(function(){
			img.remove()
		}, 1000)
	})

	setTimeout(function(){
		array.forEach(imgLink => {
			var img = document.createElement('img')
			img.src = imgLink
			img.style.opacity = 0;
			

			setTimeout(function(){
				imageContainer.appendChild(img)
				setTimeout(function(){
					img.style.opacity = 1;
				}, 100)
			}, 10)
		})
	},1000)
}
