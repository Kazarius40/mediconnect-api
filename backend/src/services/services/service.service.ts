import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '../entities/service.entity';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { FilterServiceDto } from '../dto/filter-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    await this.validateUniqueName(dto.name);

    const service = this.serviceRepository.create(dto);

    try {
      return await this.serviceRepository.save(service);
    } catch {
      throw new InternalServerErrorException(
        'An unexpected error occurred during service creation.',
      );
    }
  }

  async findAll(dto?: FilterServiceDto): Promise<Service[]> {
    const { name, sortBy, sortOrder } = dto || {};

    const query = this.serviceRepository.createQueryBuilder('service');
    query.leftJoinAndSelect('service.doctors', 'doctor');
    query.leftJoinAndSelect('doctor.clinics', 'clinic');

    if (name) {
      query.andWhere('service.name LIKE :name', { name: `%${name}%` });
    }

    const orderDirection = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    if (sortBy === 'name') {
      query.orderBy('service.name', orderDirection);
    } else {
      query.orderBy('service.id', 'ASC');
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Service> {
    return this.findOneOrFail(id, true);
  }

  async put(id: number, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOneOrFail(id);

    if (dto.name !== undefined && dto.name !== service.name) {
      await this.validateUniqueName(dto.name, id);
      service.name = dto.name;
    }

    service.description = dto.description ?? null;

    try {
      return await this.serviceRepository.save(service);
    } catch {
      throw new InternalServerErrorException(
        'An unexpected error occurred during service update.',
      );
    }
  }

  async patch(id: number, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOneOrFail(id);

    if (dto.name !== undefined && dto.name !== service.name) {
      await this.validateUniqueName(dto.name, id);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, ...rest } = dto;
    Object.assign(service, rest);

    try {
      return await this.serviceRepository.save(service);
    } catch {
      throw new InternalServerErrorException(
        'An unexpected error occurred during partial service update.',
      );
    }
  }

  async delete(id: number): Promise<void> {
    const result = await this.serviceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }
  }

  private async findOneOrFail(
    id: number,
    withRelations = false,
  ): Promise<Service> {
    const service = withRelations
      ? await this.serviceRepository.findOne({
          where: { id },
          relations: ['doctors', 'doctors.clinics'],
        })
      : await this.serviceRepository.findOneBy({ id });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }

    return service;
  }

  private async validateUniqueName(
    name: string,
    currentId?: number,
  ): Promise<void> {
    const where: FindOptionsWhere<Service> = currentId
      ? { name, id: Not(currentId) }
      : { name };

    const existing = await this.serviceRepository.findOne({ where });
    if (existing) {
      throw new ConflictException(
        `Service with name '${name}' already exists.`,
      );
    }
  }
}
