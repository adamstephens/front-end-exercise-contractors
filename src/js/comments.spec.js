const Comments = require("./comments");

function mockFetch(data) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => data
    })
  );
}

describe( 'Comments', () => {
	describe( 'fetchComments', () => {
		it("should load comments from API", async () => {
      fetch = mockFetch([]);
			const comments = new Comments({apiPath: 'foo'});
			const json = await comments.fetchComments()

      expect(Array.isArray(json)).toEqual(true)
      expect(json.length).toEqual(0)
      expect(fetch).toHaveBeenCalledTimes(1);
		});
	});

  describe( 'renderComments', () => {
		it("should render comment HTML from json parameter", async () => {
      json = [{
        "name": "Dawud Esparza",
        "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "likes": 33
      }];
      document.body.innerHTML = `
        <ul class="comments-list"></ul>
      `;

      const comments = new Comments({listSelector: '.comments-list', apiPath: 'foo'});
      comments.renderComments(json)

      const name = document.querySelector('.comment__name');
      const body = document.querySelector('.comment__body');
      const likes = document.querySelector('.comment__likes');

      expect(name.innerHTML).toBe('Dawud Esparza')
      expect(body.innerHTML).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
      expect(likes.innerHTML).toBe('33 Likes')
		});
	});

  describe( 'clearComments', () => {
		it("should clear all comments from the list", async () => {
      document.body.innerHTML = `
        <ul class="comments-list">
          <li>Foo</li>
          <li>Bar</li>
        </ul>
      `;

      const comments = new Comments({listSelector: '.comments-list', apiPath: 'foo'});
      comments.clearComments()

      const list = document.querySelector('.comments-list');

      expect(list.innerHTML).toBe('')
		});
	});

  describe( 'setClickEvent', () => {
		it("should call sort method and render method on click", async () => {
      document.body.innerHTML = `
        <label class="comments-header__sort" >
          Sort
          <button>Likes</button>
        </label>
      `;

      const comments = new Comments({listSelector: '.comments-list', apiPath: 'foo'});
      const button = document.querySelector('.comments-header__sort button');
      const sortSpy = jest.spyOn(comments, 'sortComments').mockImplementation();
      const renderSpy = jest.spyOn(comments, 'renderComments').mockImplementation();

      comments.setClickEvent();
      button.click();

      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(sortSpy).toHaveBeenCalledTimes(1);
		});
	});

  describe( 'sortComments', () => {
		it("should sort json in decesnding order of number of likes", async () => {
      const testData = [{"likes": 33},{"likes": 4},{"likes": 58},{"likes": 91},{"likes": 7}];
      const comments = new Comments({listSelector: '.comments-list', apiPath: 'foo'});

      expect(comments.sortComments(testData)).toEqual([{"likes": 91}, {"likes": 58}, {"likes": 33}, {"likes": 7}, {"likes": 4}]);
		});
	});
});
