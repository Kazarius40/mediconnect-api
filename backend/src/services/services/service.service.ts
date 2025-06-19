import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '../entities/service.entity';
import { Repository } from 'typeorm';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { FilterServiceDto } from '../dto/filter-service.dto';
import { validateUniqueness } from '../../shared/validators/validate-unique-field.util';
import { findOrFail } from '../../shared/utils/find-or-fail.util';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    await validateUniqueness(this.serviceRepository, { name: dto.name });

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
    return findOrFail(this.serviceRepository, id, {
      relations: ['doctors', 'doctors.clinics'],
    });
  }

  async put(id: number, dto: UpdateServiceDto): Promise<Service> {
    const service = await findOrFail(this.serviceRepository, id, {
      relations: ['doctors', 'doctors.clinics'],
    });

    if (dto.name !== undefined && dto.name !== service.name) {
      await validateUniqueness(this.serviceRepository, { name: dto.name }, id);
      service.name = dto.name;
    }

    service.description = dto.description ?? null;

    return this.saveAndReturn(service);
  }

  async patch(id: number, dto: UpdateServiceDto): Promise<Service> {
    const service = await findOrFail(this.serviceRepository, id, {
      relations: ['doctors', 'doctors.clinics'],
    });

    if (dto.name !== undefined && dto.name !== service.name) {
      await validateUniqueness(this.serviceRepository, { name: dto.name }, id);
    }

    Object.assign(service, dto);

    return this.saveAndReturn(service);
  }

  async delete(id: number): Promise<void> {
    const result = await this.serviceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }
  }

  private async saveAndReturn(service: Service): Promise<Service> {
    try {
      return await this.serviceRepository.save(service);
    } catch {
      throw new InternalServerErrorException(
        'An unexpected error occurred during saving service.',
      );
    }
  }
}
