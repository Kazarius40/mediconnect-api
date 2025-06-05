import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { In, Repository, Not, FindOptionsWhere } from 'typeorm';
import { Clinic } from 'src/clinics/clinic.entity';
import { Service } from 'src/services/service.entity';
import { FilterDoctorDto } from './dto/filter-doctor.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor';

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

  private async getDoctorOrThrow(id: number): Promise<Doctor> {
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

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    await this.validateUniqueEmailAndPhone(
      createDoctorDto.email,
      createDoctorDto.phone,
    );

    const doctor = await this.prepareDoctorEntity(createDoctorDto);

    return this.handleDatabaseOperation(
      async () => await this.doctorRepository.save(doctor),
    );
  }

  async findAll(filter?: FilterDoctorDto): Promise<Doctor[]> {
    const { firstName, lastName, email, phone, sortBy, sortOrder } =
      filter || {};

    const query = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.clinics', 'clinic')
      .leftJoinAndSelect('doctor.services', 'service');

    if (firstName) {
      query.andWhere('LOWER(doctor.firstName) LIKE LOWER(:firstName)', {
        firstName: `%${firstName}%`,
      });
    }
    if (lastName) {
      query.andWhere('LOWER(doctor.lastName) LIKE LOWER(:lastName)', {
        lastName: `%${lastName}%`,
      });
    }
    if (email) {
      query.andWhere('LOWER(doctor.email) LIKE LOWER(:email)', {
        email: `%${email}%`,
      });
    }
    if (phone) {
      query.andWhere('doctor.phone LIKE :phone', { phone: `%${phone}%` });
    }

    if (sortBy) {
      const orderDirection = sortOrder === 'DESC' ? 'DESC' : 'ASC';
      const orderByField = `doctor.${sortBy}`;
      query.orderBy(orderByField, orderDirection);
    } else {
      query.orderBy('doctor.id', 'ASC');
    }
    return await query.getMany();
  }

  async findOne(id: number): Promise<Doctor> {
    return this.getDoctorOrThrow(id);
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const updatedDoctor = await this.prepareAndValidateDoctorUpdate(
      id,
      updateDoctorDto,
    );

    return this.handleDatabaseOperation(
      async () => await this.doctorRepository.save(updatedDoctor),
    );
  }

  async partialUpdate(
    id: number,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    const updatedDoctor = await this.prepareAndValidateDoctorUpdate(
      id,
      updateDoctorDto,
    );

    return this.handleDatabaseOperation(
      async () => await this.doctorRepository.save(updatedDoctor),
    );
  }

  async remove(id: number): Promise<void> {
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

    if (Object.prototype.hasOwnProperty.call(dto, 'email')) {
      doctor.email = dto.email;
    }
    if (Object.prototype.hasOwnProperty.call(dto, 'phone')) {
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
    const doctor = await this.getDoctorOrThrow(id);

    const emailToValidate = dto.email !== undefined ? dto.email : doctor.email;
    const phoneToValidate = dto.phone !== undefined ? dto.phone : doctor.phone;

    await this.validateUniqueEmailAndPhone(
      emailToValidate,
      phoneToValidate,
      id,
    );

    return this.prepareDoctorEntity(dto, doctor);
  }
}
