var l = console.log
var imageContainer = document.querySelector('.imageContainer')
var popup = document.querySelector('.popup')
var popupImg = popup.querySelector('.popup__img')
var links = document.getElementsByTagName('a');


document.addEventListener('DOMContentLoaded', function(){
	if(location.search){
		var url = location.search.split('?')[1]
		var category = url.split('&')[0]
		var fullSize = url.split('&')[1]

		var xhr = new XMLHttpRequest()
		xhr.open('GET', category)
		xhr.send()
		xhr.onload = function(e){
			var images = JSON.parse(this.response)
			showImages(images)
		}

		if(fullSize != undefined){
			var src = '/' + category.split('=')[0] + '/' + category.split('=')[1] + '/' + fullSize
			//l('src : ', src)
			showPopUp(src, 1)
		}
	}
});

imageContainer.addEventListener('mousedown', e =>{
	e.preventDefault()
	var target = e.target
	if(target.nodeName != 'IMG') return
	var startX = e.clientX;
	var startLeft = getComputedStyle(imageContainer).left.match(/-?\d+/)[0]
	var width = imageContainer.offsetWidth - imageContainer.parentElement.offsetWidth 
	
	document.body.addEventListener('mousemove', dragSlider)
	document.body.addEventListener('mousemove', moveSlider)
	document.body.addEventListener('mouseout', bodyMouseOut, {once : true})
	document.body.addEventListener('mouseup', endOfMouseDown, {once : true})

	function dragSlider(e){
		if(imageContainer.dragged) return
		if(Math.abs(e.clientX - startX) < 3) return
		
		imageContainer.dragged = true

		sliderAutoSlide.pause = true
	}

	function moveSlider(e){
		if(!imageContainer.dragged) return

		var newLeft = startLeft - (startX - e.clientX)
		newLeft 	= newLeft >= 0 ? 0 : 
					  newLeft <= - width ? - width: newLeft
		//l('new left : ', newLeft)

		imageContainer.style.left = newLeft  + 'px'
	}

	function bodyMouseOut(e){
		//l(e.relatedTarget.nodeName)
		//endOfMouseDown(e)
	}

	function endOfMouseDown(e){
		document.body.removeEventListener('mousemove', dragSlider)
		document.body.removeEventListener('mousemove', moveSlider)
		document.body.removeEventListener('mouseout', bodyMouseOut)
		document.body.removeEventListener('mouseup', endOfMouseDown)

		if(imageContainer.dragged){
			delete imageContainer.dragged
			sliderAutoSlide.pause = false
		} else {
			showPopUp(target.getAttribute('src'))
		}

	}
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
		var step = 1
		var time = 50
		var width = imageContainer.offsetWidth - imageContainer.parentElement.offsetWidth

		sliderAutoSlide.timer = setTimeout(function f(){
			var currentLeft = imageContainer.style.left.match(/\-?\d+/)
			var direction = sliderAutoSlide.direction

			if(!sliderAutoSlide.pause){
				if(!direction && currentLeft >= -width){
					if(currentLeft - step <= -width){
						currentLeft = -width
						sliderAutoSlide.direction = !sliderAutoSlide.direction
					} else {
						currentLeft = +currentLeft - step
					}
				} else if(direction && currentLeft <= 0){
					if(currentLeft + step >= 0){
						currentLeft = 0
						sliderAutoSlide.direction = !sliderAutoSlide.direction
					} else {
						currentLeft = +currentLeft + step
					}
				}
			}

			imageContainer.style.left = currentLeft + 'px'
			sliderAutoSlide.timer = setTimeout(f, time)
		},0)
}

function showPopUp(imgSrc, fromCache){
	var startHref = location.href
	var relativeImgSrc = imgSrc.split('/').reverse()[0]
	var fullHref = startHref + '&' + relativeImgSrc
	if(!fromCache){
		history.pushState(null, null, fullHref);
	}

	popupImg.setAttribute('src', imgSrc)
	popup.classList.remove('popup--hidden')
	setTimeout(()=>{
		popup.classList.add('popup--visible')
	}, 100)

	popup.addEventListener('click', function(e){
		if(!fromCache){
			history.pushState(null, null, startHref);
		} else {
			l('from cache')
			l('&' + relativeImgSrc)
			l(location.href.split('&' + relativeImgSrc)[0])
			history.pushState(null, null, location.href.split('&' + relativeImgSrc)[0])
			//history.pushState(null, null, location.href.substr(0, location.href.indexOf('&')));
		}

		popup.classList.remove('popup--visible')
		setTimeout(()=>{
			popup.classList.add('popup--hidden')
		}, 1000)
	}, {once: true})
}