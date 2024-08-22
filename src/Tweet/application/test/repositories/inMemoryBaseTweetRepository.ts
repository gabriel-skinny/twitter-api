import { BaseTweet, TweetTypesEnum } from '../../entities/baseTweet';
import AbstractBaseTweetRepository from '../../repositories/base';

export class InMemoryBaseTweetRepository<T extends BaseTweet>
  implements AbstractBaseTweetRepository
{
  public baseTweetDatabase: T[] = [];
  private _type?: TweetTypesEnum;

  constructor(type?: TweetTypesEnum) {
    this._type = type;
  }

  async save(data: T): Promise<void> {
    this.baseTweetDatabase.push(data);
  }

  async existsById(id: string): Promise<boolean> {
    return !!this.baseTweetDatabase.find((t) => t.id == id);
  }

  async findById(id: string): Promise<T | null> {
    return this.baseTweetDatabase.find((t) => t.id == id);
  }

  async deleteById(id: string): Promise<void> {
    this.baseTweetDatabase = this.baseTweetDatabase.filter((t) => t.id !== id);
  }

  async updateById(data: { id: string; data: Partial<T> }): Promise<void> {
    const foundIndex = this.baseTweetDatabase.findIndex((t) => t.id == data.id);

    this.baseTweetDatabase[foundIndex] = Object.assign(
      this.baseTweetDatabase[foundIndex],
      data.data,
    );
  }
}
