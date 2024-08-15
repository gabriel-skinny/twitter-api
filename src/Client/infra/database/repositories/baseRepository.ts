import { Model as MongoModel } from 'mongoose';

export default class BaseRepository<Model extends Record<any, any>, Entity> {
  constructor(
    private mongoModel: MongoModel<Model>,
    private modelToRawMapper: (data: Model) => Entity,
    private rawToModelMapper: (data: Partial<Entity>) => Model,
  ) {}

  async save(rawEntity: Entity): Promise<void> {
    const model = this.rawToModelMapper(rawEntity);

    await this.mongoModel.create(model);
  }

  async findById(id: string): Promise<Entity | null> {
    const userModel = await this.mongoModel.findById(id);

    if (!userModel) return null;

    return this.modelToRawMapper(userModel);
  }

  async updateById({ id, data }: { id: string; data: Partial<Entity> }) {
    const model = this.rawToModelMapper(data);

    await this.mongoModel.updateOne({ id }, model);
  }

  async delete(id: string): Promise<void> {
    await this.mongoModel.deleteOne({ id });
  }
}
