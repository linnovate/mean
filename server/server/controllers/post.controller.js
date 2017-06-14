import Post from '../models/post.model';

/**
 * Load post and append to req.
 */
function load(req, res, next, id) {
  Post.get(id)
    .then((post) => {
      req.post = post;
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get post
 * @returns {Post}
 */
function get(req, res) {
  return res.json(req.post);
}

/**
 * Create new post
 * @returns {Post}
 */
function create(req, res, next) {
  const post = new Post({
    title: req.body.title,
  });

  post.save()
    .then(savedPost => res.json(savedPost))
    .catch(e => next(e));
}

/**
 * Update existing post
 * @property {string} req.body.title - The title of post.
 * @returns {Post}
 */
function update(req, res, next) {
  const post = req.post;
  post.title = req.body.title;
  post.save()
    .then(savedPost => res.json(savedPost))
    .catch(e => next(e));
}

/**
 * Get post list.
 * @property {number} req.query.skip - Number of posts to be skipped.
 * @property {number} req.query.limit - Limit number of posts to be returned.
 * @returns {Post[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Post.list({ limit, skip })
    .then(posts => res.json(posts))
    .catch(e => next(e));
}

/**
 * Delete post.
 * @returns {Post}
 */
function remove(req, res, next) {
  const post = req.post;
  post.remove()
    .then(deletedPost => res.json(deletedPost))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
