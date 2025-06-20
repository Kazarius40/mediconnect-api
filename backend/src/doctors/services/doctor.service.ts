import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from '../entities/doctor.entity';
import { In, Repository } from 'typeorm';
import { Clinic } from 'src/clinics/entities/clinic.entity';
import { Service } from 'src/services/entities/service.entity';
import { FilterDoctorDto } from '../dto/filter-doctor.dto';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor';
import { validateUniqueness } from '../../shared/validators/validate-unique-field.util';
import { findOrFail } from '../../shared/utils/find-or-fail.util';

@Injectable()
export class DoctorService {
  private readonly logger = new Logger(DoctorService.name);

  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,

    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(dto: CreateDoctorDto): Promise<Doctor> {
    await validateUniqueness(this.doctorRepository, {
      email: dto.email,
      phone: dto.phone,
    });
    const doctor = await this.buildDoctor(dto);
    this.logger.log(`Doctor with ID ${doctor.id} created successfully.`);
    return this.handleDb(() => this.doctorRepository.save(doctor));
  }

  async findAll(filter?: FilterDoctorDto): Promise<Doctor[]> {
    const query = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.clinics', 'clinic')
      .leftJoinAndSelect('doctor.services', 'service');

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          key === 'sortBy' ||
          key === 'sortOrder'
        ) {
          return;
        }

        if (typeof value === 'string') {
          query.andWhere(`LOWER(doctor.${key}) LIKE LOWER(:${key})`, {
            [key]: `%${value}%`,
          });
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          query.andWhere(`doctor.${key} = :${key}`, { [key]: value });
        }
      });
    }

    if (filter?.sortBy) {
      const orderDirection = filter.sortOrder === 'DESC' ? 'DESC' : 'ASC';
      const orderByField = `doctor.${filter.sortBy}`;
      query.orderBy(orderByField, orderDirection);
    } else {
      query.orderBy('doctor.id', 'ASC');
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Doctor> {
    return findOrFail(this.doctorRepository, id, {
      relations: ['clinics', 'services'],
    });
  }

  async put(id: number, dto: UpdateDoctorDto): Promise<Doctor> {
    const updatedDoctor = await this.updateDoctor(id, dto);
    this.logger.log(`Doctor with ID ${id} updated successfully.`);
    return this.handleDb(() => this.doctorRepository.save(updatedDoctor));
  }

  async patch(id: number, dto: UpdateDoctorDto): Promise<Doctor> {
    const updatedDoctor = await this.updateDoctor(id, dto);
    this.logger.log(`Doctor with ID ${id} patched successfully.`);
    return this.handleDb(() => this.doctorRepository.save(updatedDoctor));
  }

  async delete(id: number): Promise<void> {
    const result = await this.doctorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Doctor with ID ${id} not found.`);
    }
    this.logger.log(`Doctor with ID ${id} deleted successfully.`);
  }

  private async buildDoctor(
    dto: CreateDoctorDto | UpdateDoctorDto,
    doctor: Doctor = new Doctor(),
  ): Promise<Doctor> {
    doctor.firstName = dto.firstName ?? doctor.firstName;
    doctor.lastName = dto.lastName ?? doctor.lastName;

    if (dto.email !== undefined) {
      doctor.email = dto.email;
    }

    if (dto.phone !== undefined) {
      doctor.phone = dto.phone;
    }

    if (dto.clinics !== undefined) {
      doctor.clinics = dto.clinics.length
        ? await this.clinicRepository.findBy({ id: In(dto.clinics) })
        : [];
    }

    if (dto.services !== undefined) {
      doctor.services = dto.services.length
        ? await this.serviceRepository.findBy({ id: In(dto.services) })
        : [];
    }

    return doctor;
  }

  private async updateDoctor(
    id: number,
    dto: UpdateDoctorDto,
  ): Promise<Doctor> {
    const doctor = await findOrFail(this.doctorRepository, id, {
      relations: ['clinics', 'services'],
    });

    await validateUniqueness(
      this.doctorRepository,
      { email: dto.email, phone: dto.phone },
      id,
    );

    return this.buildDoctor(dto, doctor);
  }

  private async handleDb<T>(operation: () => Promise<T>): Promise<T> {
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
        `An unexpected error occurred during database operation.`,
      );
    }
  }
}
