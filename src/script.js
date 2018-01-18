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
		array.forEach((imgLink, i) => {
			var img = document.createElement('img')
			img.src = imgLink
			img.style.opacity = 0;
			

			setTimeout(function(){
				imageContainer.appendChild(img)
				setTimeout(function(){
					img.style.opacity = 1;

					if(i == array.length - 1){
						sliderAutoSlide()
					}
				}, 100)
			}, 10)
		})
	},1000)
}

function sliderAutoSlide(){
	
		if(sliderAutoSlide.timer){
			clearTimeout(sliderAutoSlide.timer)
		}

		if(sliderAutoSlide.direction == undefined){
			sliderAutoSlide.direction = false
		}

		imageContainer.style.left = 0
		var left = 0
		var step = 1
		var time = 15
		var width = imageContainer.offsetWidth - imageContainer.parentElement.offsetWidth

		sliderAutoSlide.timer = setTimeout(function f(){
			if(!sliderAutoSlide.pause){
				if(!sliderAutoSlide.direction && left > -width){
					left -= step
				} else if(!sliderAutoSlide.direction && left <= -width) {
					sliderAutoSlide.direction = !sliderAutoSlide.direction
				} else if(sliderAutoSlide.direction && left < 0){
					left += step
				} else if(sliderAutoSlide.direction && left >= 0){
					sliderAutoSlide.direction = !sliderAutoSlide.direction
				}

				imageContainer.style.left = left + 'px'
			}

			sliderAutoSlide.timer = setTimeout(f, time)
		},0)
	
}