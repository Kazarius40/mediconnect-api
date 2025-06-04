import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { Repository, Not, FindOptionsWhere } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FilterServiceDto } from './dto/filter-service.dto';

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name);

  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  private async getServiceOrThrow(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOneBy({ id });
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

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    await this.validateUniqueName(createServiceDto.name);

    let newId: number | null = null;
    const services = await this.serviceRepository.find({
      order: { id: 'ASC' },
      select: ['id'],
    });

    if (services.length === 0 || services[0].id !== 1) {
      newId = 1;
    } else {
      for (let i = 0; i < services.length; i++) {
        if (services[i].id !== i + 1) {
          newId = i + 1;
          break;
        }
      }
      if (newId === null) {
        newId = services[services.length - 1].id + 1;
      }
    }

    const service = this.serviceRepository.create({
      id: newId,
      ...createServiceDto,
    });

    try {
      const savedService = await this.serviceRepository.save(service);
      this.logger.log(
        `Service with ID ${savedService.id} created successfully.`,
      );
      return savedService;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error creating service: ${error.message}`);
      } else {
        this.logger.error('Unknown error creating service');
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during service creation.',
      );
    }
  }

  async findAll(filterDto?: FilterServiceDto): Promise<Service[]> {
    const { name, sortBy, sortOrder } = filterDto || {};

    const query = this.serviceRepository.createQueryBuilder('service');

    if (name) {
      query.andWhere('service.name LIKE :name', { name: `%${name}%` });
    }

    if (sortBy) {
      const orderDirection = sortOrder === 'DESC' ? 'DESC' : 'ASC';
      if (sortBy === 'name') {
        query.orderBy('service.name', orderDirection);
      }
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Service> {
    return this.getServiceOrThrow(id);
  }

  async update(
    id: number,
    updateServiceDto: CreateServiceDto,
  ): Promise<Service> {
    const service = await this.getServiceOrThrow(id);

    if (updateServiceDto.name && updateServiceDto.name !== service.name) {
      await this.validateUniqueName(updateServiceDto.name, id);
    }

    service.name = updateServiceDto.name;
    service.description =
      updateServiceDto.description === undefined
        ? null
        : updateServiceDto.description;

    try {
      const updatedService = await this.serviceRepository.save(service);
      this.logger.log(
        `Service with ID ${updatedService.id} updated successfully.`,
      );
      return updatedService;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Error updating service with ID ${id}: ${error.message}`,
        );
      } else {
        this.logger.error('Unknown error updating service with ID ${id}');
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during service update.',
      );
    }
  }

  async partialUpdate(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const service = await this.getServiceOrThrow(id);

    if (updateServiceDto.name && updateServiceDto.name !== service.name) {
      await this.validateUniqueName(updateServiceDto.name, id);
    }

    Object.assign(service, updateServiceDto);

    try {
      const updatedService = await this.serviceRepository.save(service);
      this.logger.log(
        `Service with ID ${updatedService.id} partially updated successfully.`,
      );
      return updatedService;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Error partially updating service with ID ${id}: ${error.message}`,
        );
      } else {
        this.logger.error(
          'Unknown error partially updating service with ID ${id}',
        );
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during partial service update.',
      );
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.serviceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }
    this.logger.log(`Service with ID ${id} deleted successfully.`);
  }
}
