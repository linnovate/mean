import Post from '../models/post.model';


function load(params) {
  return Post.get(params.id);
}

function get(req, res) {
  return res.json(req.post);
}

function create(params) {
  const post = new Post({
    title: params.data.title,
  });
  return post.save();
}

function update(req, res, next) {
  const post = req.post;
  post.title = req.body.title;
  post.save()
    .then(savedPost => res.json(savedPost))
    .catch(e => next(e));
}

function list(params) {
  const { limit = 50, skip = 0 } = params;
  return Post.list({ limit, skip })
}

function remove(params) {
  return load(params).then(post => post.remove());
}

export default { load, get, create, update, list, remove };
