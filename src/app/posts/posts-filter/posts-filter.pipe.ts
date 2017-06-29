import {PipeTransform,Pipe} from '@angular/core';
import {IPost} from '../post.interface'
@Pipe({
    name:'postsFilter'
})
export class PostsFilterPipe implements PipeTransform{
transform(value :IPost[], filtetBy:string):IPost[]{
    filtetBy= filtetBy? filtetBy.toLocaleLowerCase():null;//search in each product if is the same
    return filtetBy ? value.filter((post:IPost)=>post.title.toLocaleLowerCase().indexOf(filtetBy) !==-1) : value;
}

}