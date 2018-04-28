import { PipeTransform, Pipe } from '@angular/core';
import { IPost } from '../post.interface';

@Pipe({
    name: 'myPostsFilter'
})
export class PostsFilterPipe implements PipeTransform {
    public transform(value: IPost[], filtetBy: string): IPost[] {
        filtetBy = filtetBy ? filtetBy.toLocaleLowerCase() : null;
        // search in each product if is the same
        return filtetBy
            ? value.filter(
                ({title}: IPost) => title.toLocaleLowerCase().indexOf(filtetBy) !== -1
            )
            : value;
    }
}
