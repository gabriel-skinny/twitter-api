import { Model as MongoModel } from 'mongoose';

export default class BaseRepository<Model extends Record<any, any>, Entity> {
  constructor(
    private mongoModel: MongoModel<Model>,
    private modelMapper: (data: Model) => Entity,
  ) {}

  async save(data: Entity): Promise<void> {
    await this.mongoModel.create(data);
  }

  async findById(id: string): Promise<Entity | null> {
    const userModel = await this.mongoModel.findById(id);

    if (!userModel) return null;

    return this.modelMapper(userModel);
  }

  async delete(id: string): Promise<void> {
    await this.mongoModel.deleteOne({ id });
  }
}
