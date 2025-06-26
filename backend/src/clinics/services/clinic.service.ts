import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from '../entities/clinic.entity';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { UpdateClinicDto } from '../dto/update-clinic.dto';
import { FilterClinicDto } from '../dto/filter-clinic.dto';
import { findOrFail } from 'src/shared/utils/typeorm/find-or-fail.util';
import { validateEntityUniqueness } from '../../shared/validators/validate-entity-uniqueness.util';

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,
  ) {}

  async create(dto: CreateClinicDto): Promise<Clinic> {
    await validateEntityUniqueness(this.clinicRepository, {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
    });

    const clinic = this.clinicRepository.create(dto);

    return this.handleDb(
      async () => await this.clinicRepository.save(clinic),
      'clinic creation',
    );
  }

  async findAll(filter?: FilterClinicDto): Promise<Clinic[]> {
    const { name, sortBy, sortOrder } = filter || {};

    const query = this.clinicRepository
      .createQueryBuilder('clinic')
      .leftJoinAndSelect('clinic.doctors', 'doctor')
      .leftJoinAndSelect('doctor.services', 'service');

    if (name) {
      query.andWhere('LOWER(clinic.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (sortBy) {
      const orderDirection = sortOrder === 'DESC' ? 'DESC' : 'ASC';
      const orderByField = `clinic.${sortBy}`;
      query.orderBy(orderByField, orderDirection);
    } else {
      query.orderBy('clinic.id', 'ASC');
    }
    return query.getMany();
  }

  async findOne(id: number): Promise<Clinic> {
    return findOrFail(this.clinicRepository, id, {
      relations: ['doctors', 'doctors.services'],
    });
  }

  async put(id: number, dto: CreateClinicDto): Promise<Clinic> {
    const clinic = await findOrFail(this.clinicRepository, id, {
      relations: ['doctors', 'doctors.services'],
    });

    await validateEntityUniqueness(
      this.clinicRepository,
      { name: dto.name, email: dto.email, phone: dto.phone },
      id,
    );

    Object.assign(clinic, dto);

    return this.handleDb(
      async () => await this.clinicRepository.save(clinic),
      'clinic update',
    );
  }

  async patch(id: number, dto: UpdateClinicDto): Promise<Clinic> {
    const clinic = await findOrFail(this.clinicRepository, id, {
      relations: ['doctors', 'doctors.services'],
    });

    await validateEntityUniqueness(
      this.clinicRepository,
      { name: dto.name, email: dto.email, phone: dto.phone },
      id,
    );

    if (dto.name !== undefined) clinic.name = dto.name;
    if (dto.address !== undefined) clinic.address = dto.address;
    if (dto.phone !== undefined) clinic.phone = dto.phone;
    if (dto.email !== undefined) clinic.email = dto.email;

    return this.handleDb(
      async () => await this.clinicRepository.save(clinic),
      'Partial clinic update',
    );
  }

  async delete(id: number): Promise<void> {
    const result = await this.clinicRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Clinic with ID ${id} not found.`);
    }
  }

  private async handleDb<T>(
    operation: () => Promise<T>,
    context: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `An unexpected error occurred during ${context}.`,
      );
    }
  }
}
