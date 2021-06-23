const Comments = require('./comments');

const comments = new Comments({
  apiPath: 'https://my-json-server.typicode.com/telegraph/front-end-exercise-contractors/comments',
  listSelector: '.comments-list'
});
comments.init();




