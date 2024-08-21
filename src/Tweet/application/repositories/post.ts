import { Post } from '../entities/Post';
import AbstractBaseTweetRepository from './base';

export default abstract class AbstractPostRepository extends AbstractBaseTweetRepository<Post> {}
