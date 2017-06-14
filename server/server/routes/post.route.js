import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import postCtrl from '../controllers/post.controller';

const router = express.Router();

router.route('/')
  /** GET /api/posts - Get list of posts */
  .get(postCtrl.list)

  /** POST /api/posts - Create new post */
  .post(validate(paramValidation.createPost), postCtrl.create);

router.route('/:postId')
  /** GET /api/post/:postId - Get post */
  .get(postCtrl.get)

  /** PUT /api/posts/:postId - Update post */
  .put(validate(paramValidation.updatePost), postCtrl.update)

  /** DELETE /api/posts/:postId - Delete post */
  .delete(postCtrl.remove);

/** Load post when API with postId route parameter is hit */
router.param('postId', postCtrl.load);

export default router;
