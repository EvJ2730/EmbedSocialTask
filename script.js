let page = 0;
let pageData = [];
let loadedAll = false;
document.querySelector('.backdrop').addEventListener('click', (e) => {
	const overlay = document.querySelector('.overlay');
	if (overlay.classList.contains('show')) {
		overlay.classList.toggle('show');
	}
})

document.querySelector('.big-card-likes').addEventListener('click', (e) => {
	bigLikeClick(e);
})

fetch("./data.json")
	.then(response => response.json())
	.then(data => {
		pageData = data;
		loadData();
	})
	.catch(error => {
		console.log('error: ' + error)
	});

function addCard(data) {
	const mainContainer = document.getElementById("container");
	data.forEach((post, i) => {
		const card = createCard(post, i + page);
		mainContainer.appendChild(card)
	})

}

function bigLikeClick(e) {	
	const bigLike = document.querySelector('.big-card-likes-src');
	const bigCard = document.querySelector('.big-card');

	const index = parseInt(bigCard.getAttribute('post-id'));
	const smallCardLike = document.getElementById(index).querySelector('.like-button')
	console.log(bigLike.classList.contains('liked'))
	if (bigLike.classList.contains('liked')) {
		pageData[index].likes--;

		smallCardLike.setAttribute('src', './images/heart.svg')
		bigLike.setAttribute('src', './images/heart.svg')
	} else {
		pageData[index].likes++;

		smallCardLike.setAttribute('src', './images/heart_clicked.svg')
		bigLike.setAttribute('src', './images/heart_clicked.svg')
	}

	document.querySelector('.big-card-num-likes').innerHTML = pageData[index].likes;
	smallCardLike.nextElementSibling.innerHTML = pageData[index].likes;

	smallCardLike.classList.toggle('liked')
	bigLike.classList.toggle('liked')
}

function loadData() {
	if (pageData.length - 1 >= page + 3) {
		console.log('can load more')
		let nextPageData = pageData.slice(page, page + 4);
		addCard(nextPageData);
		page += 4;
	} else {
		loadedAll = true;
		console.log("can't load more")
	}
}

// CARD
function createCard(post, i) {
	const card = document.createElement('div');
	card.setAttribute('id', i);
	card.classList.add("card-container");
	card.addEventListener('click', (e) => {
		if (e.target.classList.contains('like-button')) {
			likePost(e.target);
		} else {
			const id = parseInt(e.currentTarget.id);
			clickCard(id);
		}
	})

	card.append(createHeaderRow(post));
	card.append(createImageRow(post));
	card.append(createCaptionRow(post));
	card.append(createActionRow(post));
	return card;
}

// HEADER
function createHeaderRow(post) {
	let header = document.createElement('div');
	header.classList.add('header');

	let authorImage = document.createElement('img');
	authorImage.setAttribute('src', post.profile_image);
	authorImage.classList.add('author-image');

	let postInfoContainer = document.createElement('span');
	postInfoContainer.classList.add('post-info-container');

	let author = document.createElement('div');
	author.innerHTML = post.name;
	author.classList.add('author');

	let date = document.createElement('div');
	date.innerHTML = formatDate(post.date);
	date.classList.add('date');

	postInfoContainer.append(author)
	postInfoContainer.append(date)

	let link = document.createElement('a');
	let imageSource = document.createElement('img');
	let url = "./images/" + post.source_type + ".svg"
	imageSource.setAttribute('src', url);
	link.setAttribute('href', post.source_link);
	link.append(imageSource);
	imageSource.classList.add('imgSource');

	header.append(authorImage);
	header.append(postInfoContainer);
	header.append(link);

	return header;
}

// DATE
function formatDate(date) {
	let d = new Date(date);
	let day = d.toLocaleString('default', { day: '2-digit' });
	let month = d.toLocaleString('default', { month: 'short' });
	let year = d.toLocaleString('default', { year: 'numeric' });
	return day + " " + month + " " + year;
}

// IMAGE
function createImageRow(post) {
	let imageContainer = document.createElement('div')
	imageContainer.classList.add('imageContainer');
	imageContainer.style.backgroundImage = "url(" + post.image + ")";

	return imageContainer;
}

// CAPTION
function createCaptionRow(post) {
	let caption = document.createElement('div')
	caption.classList.add('caption');
	caption.innerHTML = post.caption;
	return caption;
}

// ACTION
function createActionRow(post) {
	let action = document.createElement('div')
	action.classList.add('action');

	let heartIcon = document.createElement('img');
	heartIcon.classList.add('like-button');
	heartIcon.src = './images/heart.svg';

	let numLikes = document.createElement('span');
	numLikes.classList.add('likes');
	numLikes.innerHTML = post.likes;

	action.append(heartIcon);
	action.append(numLikes);

	return action;
}

function clickCard(id) {
	const post = pageData[id];
	const overlay = document.querySelector('.overlay');
	const imageUrl = "./images/" + post.source_type + ".svg"
	const isLiked = !!document.getElementById(id).querySelector('.liked');
	overlay.classList.toggle('show');
	
	document.querySelector('.big-card').setAttribute('post-id', id);
	document.querySelector('.big-card-author-image').setAttribute('src', post.profile_image);
	document.querySelector('.big-card-author').innerHTML = post.name;
	document.querySelector('.big-card-date').innerHTML = formatDate(post.date);
	document.querySelector('.big-card-imgSource').setAttribute('src', imageUrl);
	document.querySelector('.big-card-link').setAttribute('href', post.source_link);
	document.querySelector('.big-card-caption').innerHTML = pageData[id].caption
	document.querySelector('.big-card-num-likes').innerHTML = pageData[id].likes;
	document.querySelector('.big-card-image-container').style.backgroundImage = `url('${pageData[id].image}'`

	if(isLiked) {
		document.querySelector('.big-card-likes-src').classList.toggle('liked')
		document.querySelector('.big-card-likes-src').setAttribute('src', './images/heart_clicked.svg')
	}  else {
		if(document.querySelector('.big-card-likes-src').classList.contains('liked')) {
			document.querySelector('.big-card-likes-src').classList.toggle('liked')
		}
		document.querySelector('.big-card-likes-src').setAttribute('src', './images/heart.svg')
	}
}

function closeCard() {
	document.querySelector("overlay").toggle('show');
}

function likePost(el) {
	let index = parseInt(el.parentElement.parentElement.id);
	if (el.classList.contains('liked')) {
		pageData[index].likes--;
		el.setAttribute('src', './images/heart.svg')
	} else {
		el.setAttribute('src', './images/heart_clicked.svg')
		pageData[index].likes++;
	}
	el.nextElementSibling.innerHTML = pageData[index].likes;
	el.classList.toggle('liked')
}