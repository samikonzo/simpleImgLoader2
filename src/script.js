var l = console.log
var imageContainer = document.querySelector('.imageContainer')
var popup = document.querySelector('.popup')
var popupImg = popup.querySelector('.popup__img')
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

imageContainer.addEventListener('mouseover', function(e){
	var target = this
	var relatedTarget = e.relatedTarget
	if(target.contains(relatedTarget)) return



	sliderAutoSlide.pause = true
})
imageContainer.addEventListener('mouseout', function(e){
	var target = this
	var relatedTarget = e.relatedTarget
	if(target.contains(relatedTarget)) return

	sliderAutoSlide.pause = false
})
imageContainer.addEventListener('click', e => {
	var target = e.target
	if(target.nodeName != 'IMG') return
	showPopUp(target)
})



;[].forEach.call(links, link => {
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
		var time = 50
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

function showPopUp(img){
	popupImg.setAttribute('src', img.src)
	popup.classList.remove('popup--hidden')
	setTimeout(()=>{
		popup.classList.add('popup--visible')
	}, 100)

	popup.addEventListener('click', function(e){
		popup.classList.remove('popup--visible')
		setTimeout(()=>{
			popup.classList.add('popup--hidden')
		}, 1000)
	}, {once: true})
}