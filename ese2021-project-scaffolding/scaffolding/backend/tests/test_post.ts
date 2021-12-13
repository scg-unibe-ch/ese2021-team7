import {describe} from 'mocha';
import * as chai from 'chai';

import {PostService} from '../src/services/post.service';
import {Post} from '../src/models/post.model';

chai.use(require('chai-as-promised'));

describe('Test getting posts', () => {
    describe('Test getting existing post by id', () => {
        it('Should return a Promise with the post if the post is existing', () => {
            const postService = new PostService();
            const post = postService.getPostById('1', '1')
                .then(newpost => post);
            console.log(post);
        });
    });
});

describe('Test creation of posts', () => {
    describe('Test creation of posts', () => {
        it('should create a post which is visible in the db', () => {
            const post = {title: 'title'} as Post;
            const postService = new PostService();
            postService.createPost(post, '1');
        });
    });
});
