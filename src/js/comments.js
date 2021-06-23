/**
 * Comments class
 * @param {Object} params - containing:
 * @param {String} apiPath - the pathname of the api (defaults to '')
 * @param {String} listSelector - selector for the comments list element (defaults to '.comments-list')
 */
class Comments {
	constructor(params) {
		this.params = Object.assign({
			apiPath: '',
			listSelector: '.comments-list'
		}, params);

		this.$listElement = document.querySelector(`${this.params.listSelector}`);
	}

	/**
	 * Initialise class, which will fetch data and render comments once response received
	 */
	init() {
		this.fetchComments(this.params.apiPath).then((json) => {
			this.renderComments(json)
			this.contentData = json;
		}).catch(e => console.log(e)); //TODO - better error handling
		this.setClickEvent()
	}

	/**
	 * Set click event listener on sorting button
	 */
	setClickEvent() {
		const el = document.querySelector('.comments-header__button');
		el.addEventListener('click', (event) => {
			const sortedData = this.sortComments(this.contentData);
			this.renderComments(sortedData);
		});
	}

	/**
	 * Fetch comments data from supplied API path
	 * @param {String} path - the api path to fetch from
	 */
	async fetchComments(path) { // TODO - this could prbaly be a reusable util
		// TODO - Some kind of loading spinner
		const response = await fetch(path);

		if (!response.ok) {
			const message = `An error has occured: ${response.status}`;
			throw new Error(message);
		}

		return await response.json();
	}

	/**
	 * Render the comments inside the $listElement container, and display number of comments
	 * @param {Array} json - the json to be rendered
	 */
	renderComments(json) {
		this.clearComments();

		json.forEach(comment => {
			this.$listElement.insertAdjacentHTML('beforeend',`
			<li class="comment">
				<h3 class="comment__name">${comment.name}</h3>
				<p class="comment__body">${comment.body}</p>
				<p class="comment__likes">${comment.likes} Likes</p>
			</li>
			`)
		});

		const $counter = document.querySelector('.comments-header__title span');
		$counter.innerHTML = json.length
	}

	/**
	 * Clear comments list
	 */
	clearComments() {
		this.$listElement.innerHTML = "";
	}

	/**
	 * Sort based on number of likes
	 * @param {Array} json - the json to be sorted
	 * @return {Array}
	 */
	sortComments(json) {
		return json.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes));
	}
}

module.exports = Comments;
