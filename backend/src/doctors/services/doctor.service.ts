import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from '../entities/doctor.entity';
import { In, Repository, Not, FindOptionsWhere } from 'typeorm';
import { Clinic } from 'src/clinics/entities/clinic.entity';
import { Service } from 'src/services/entities/service.entity';
import { FilterDoctorDto } from '../dto/filter-doctor.dto';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,

    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  private async handleDatabaseOperation<T>(
    operation: () => Promise<T>,
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
        `An unexpected error occurred during database operation.`,
      );
    }
  }

  async create(dto: CreateDoctorDto): Promise<Doctor> {
    await this.validateUniqueEmailAndPhone(dto.email, dto.phone);

    const doctor = await this.prepareDoctorEntity(dto);

    return this.handleDatabaseOperation(() =>
      this.doctorRepository.save(doctor),
    );
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
    return this.findOneOrFail(id);
  }

  async put(id: number, dto: UpdateDoctorDto): Promise<Doctor> {
    const updatedDoctor = await this.prepareAndValidateDoctorUpdate(id, dto);

    return this.handleDatabaseOperation(() =>
      this.doctorRepository.save(updatedDoctor),
    );
  }

  async patch(id: number, dto: UpdateDoctorDto): Promise<Doctor> {
    const updatedDoctor = await this.prepareAndValidateDoctorUpdate(id, dto);

    return this.handleDatabaseOperation(() =>
      this.doctorRepository.save(updatedDoctor),
    );
  }

  async delete(id: number): Promise<void> {
    const result = await this.doctorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Doctor with ID ${id} not found.`);
    }
  }

  private async prepareDoctorEntity(
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

  private async prepareAndValidateDoctorUpdate(
    id: number,
    dto: UpdateDoctorDto,
  ): Promise<Doctor> {
    const doctor = await this.findOneOrFail(id);

    const emailToValidate = dto.email !== undefined ? dto.email : doctor.email;
    const phoneToValidate = dto.phone !== undefined ? dto.phone : doctor.phone;

    await this.validateUniqueEmailAndPhone(
      emailToValidate,
      phoneToValidate,
      id,
    );

    return this.prepareDoctorEntity(dto, doctor);
  }

  private async findOneOrFail(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['clinics', 'services'],
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found.`);
    }
    return doctor;
  }

  private async validateUniqueEmailAndPhone(
    email: string | undefined,
    phone: string | undefined,
    currentId?: number,
  ): Promise<void> {
    if (email === undefined && phone === undefined) {
      return;
    }

    const whereConditions: FindOptionsWhere<Doctor>[] = [];

    if (email !== undefined) {
      whereConditions.push({ email });
    }
    if (phone !== undefined) {
      whereConditions.push({ phone });
    }
    if (whereConditions.length === 0) {
      return;
    }

    const conditionsWithNotCurrentId: FindOptionsWhere<Doctor>[] =
      whereConditions.map((condition) => {
        if (currentId) {
          return { ...condition, id: Not(currentId) };
        }
        return condition;
      });

    const existingDoctor = await this.doctorRepository.findOne({
      where: conditionsWithNotCurrentId,
    });

    if (existingDoctor) {
      if (email !== undefined && existingDoctor.email === email) {
        throw new ConflictException(
          `Doctor with email '${email}' already exists.`,
        );
      }
      if (phone !== undefined && existingDoctor.phone === phone) {
        throw new ConflictException(
          `Doctor with phone '${phone}' already exists.`,
        );
      }
    }
  }
}
