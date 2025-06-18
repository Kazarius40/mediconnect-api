import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Clinic } from '../entities/clinic.entity';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { UpdateClinicDto } from '../dto/update-clinic.dto';
import { FilterClinicDto } from '../dto/filter-clinic.dto';

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,
  ) {}

  async create(dto: CreateClinicDto): Promise<Clinic> {
    await this.validateUniqueness(dto.name, dto.email, dto.phone);

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
    return this.findOrFail(id);
  }

  async put(id: number, dto: CreateClinicDto): Promise<Clinic> {
    const clinic = await this.findOrFail(id);

    const name = dto.name;
    const email = dto.email !== undefined ? dto.email : clinic.email;
    const phone = dto.phone;

    await this.validateUniqueness(name, email, phone, id);

    Object.assign(clinic, dto);

    return this.handleDb(
      async () => await this.clinicRepository.save(clinic),
      'clinic update',
    );
  }

  async patch(id: number, dto: UpdateClinicDto): Promise<Clinic> {
    const clinic = await this.findOrFail(id);

    const name: string = dto.name ?? clinic.name;
    const email = dto.email ?? clinic.email;
    const phone: string = dto.phone ?? clinic.phone;

    if (phone === null || phone === undefined) {
      throw new InternalServerErrorException(
        'Phone number cannot be null or undefined for unique validation.',
      );
    }

    await this.validateUniqueness(name, email, phone, id);

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

  private async validateUniqueness(
    name: string,
    email: string | undefined,
    phone: string,
    currentId?: number,
  ): Promise<void> {
    const notCurrentIdCondition = currentId ? { id: Not(currentId) } : {};

    const existingByName = await this.clinicRepository.findOne({
      where: { name, ...notCurrentIdCondition },
    });
    if (existingByName) {
      throw new ConflictException(`Clinic with name '${name}' already exists.`);
    }

    if (email !== undefined && email !== null) {
      const existingByEmail = await this.clinicRepository.findOne({
        where: { email, ...notCurrentIdCondition },
      });
      if (existingByEmail) {
        throw new ConflictException(
          `Clinic with email '${email}' already exists.`,
        );
      }
    }

    const existingByPhone = await this.clinicRepository.findOne({
      where: { phone, ...notCurrentIdCondition },
    });
    if (existingByPhone) {
      throw new ConflictException(
        `Clinic with phone '${phone}' already exists.`,
      );
    }
  }

  private async findOrFail(id: number): Promise<Clinic> {
    const clinic = await this.clinicRepository.findOne({
      where: { id },
      relations: ['doctors', 'doctors.services'],
    });
    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found.`);
    }
    return clinic;
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
