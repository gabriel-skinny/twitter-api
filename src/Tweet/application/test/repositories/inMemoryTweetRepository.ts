import { TweetTypesEnum } from '../../entities/baseTweet';
import { Post } from '../../entities/Post';
import AbstractPostRepository from '../../repositories/post';
import { InMemoryBaseTweetRepository } from './inMemoryBaseTweetRepository';

export class InMemoryPostRepository
  extends InMemoryBaseTweetRepository<Post>
  implements AbstractPostRepository
{
  constructor() {
    super(TweetTypesEnum.POST);
  }
}
