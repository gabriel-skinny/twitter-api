import { TweetTypesEnum } from '../../entities/baseTweet';
import { Tweet } from '../../entities/Tweet';
import { InMemoryBaseTweetRepository } from './inMemoryBaseTweetRepository';

export class InMemoryTweetRepository extends InMemoryBaseTweetRepository<Tweet> {
  constructor() {
    super(TweetTypesEnum.POST);
  }
}
