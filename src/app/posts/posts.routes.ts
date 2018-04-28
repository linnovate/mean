import { PostListComponent } from './post-list/post-list.component';
import { NewPostComponent } from './new-post/new-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';

export const routes = [
    {
        path: '', children: [
            { path: '', component: PostListComponent },
            { path: 'post-detail/:id', component: PostDetailComponent },
            { path: 'new', component: NewPostComponent },
            { path: 'edit/:id', component: EditPostComponent }

        ]
    },
];
