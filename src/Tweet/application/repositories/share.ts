import { Share } from '../entities/Share';
import AbstractBaseTweetRepository from './base';

export default abstract class AbstractShareRepository extends AbstractBaseTweetRepository<Share> {
  abstract existsByUserIdAndParentId(data: {
    userId: string;
    parentId: string;
  }): Promise<Share | null>;
}
