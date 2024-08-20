import { Tweet } from '../entities/Tweet';
import AbstractBaseTweetRepository from './base';

export default abstract class AbstractTweetRepository extends AbstractBaseTweetRepository<Tweet> {}
