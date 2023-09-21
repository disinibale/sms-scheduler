import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from 'src/models/messages.model';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Messages)
    private readonly messageRepository: Repository<Messages>,
  ) {}

  createLog() {
    return 'SUCCESS ON BEING HITTED';
  }

  async save(data: Partial<Messages>): Promise<Messages> {
    return this.messageRepository.save(data);
  }

  async updateById(
    id: string,
    data: Partial<Messages>,
  ): Promise<Messages | null> {
    const message = this.messageRepository.findOne({ where: { id } });
    if (!message) {
      return null;
    }

    return this.messageRepository.save(data);
  }

  async getById(id: string): Promise<Messages[] | null> {
    return await this.messageRepository.find({ where: { id } });
  }

  async saveWithTransaction(
    data: Partial<Messages>,
    transaction,
  ): Promise<Messages> {
    if (transaction) return transaction.save(Messages, data);
    console.log('HITTED ON THE MESSAGE SERVICE : !!!!!');
    return this.messageRepository.save(data);
  }

  async updateByIdWithTransaction(
    id: string,
    data: Partial<Messages>,
    transaction,
  ): Promise<Messages | null> {
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (!message) {
      return null;
    }

    if (transaction) {
      return transaction.save(Messages, message);
    }
    return this.messageRepository.save(message);
  }
}
