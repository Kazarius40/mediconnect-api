import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from '../entities/doctor.entity';
import { In, Repository } from 'typeorm';
import { Clinic } from 'src/clinics/entities/clinic.entity';
import { Service } from 'src/services/entities/service.entity';
import { FilterDoctorDto } from '../dto/filter-doctor.dto';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor';
import { validateUniqueness } from '../../shared/validators/validate-unique-field.util';
import { findOrFail } from '../../shared/utils/typeorm/find-or-fail.util';
import { applyFilters } from '../../shared/utils/query/apply-filters.util';
import { QUERY_ALIASES } from '../../shared/utils/query/query-aliases';
import { handleDb } from '../../shared/utils/db/handle-db.util';
import { updateEntityFields } from '../../shared/utils/entity/update-entity-fields.util';
import { resolveRelations } from '../../shared/utils/entity/resolve-relations.util';
import { buildEntity } from '../../shared/utils/entity/build-entity.util';

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
  private readonly RELATIONS = ['clinics', 'services'];

  async create(dto: CreateDoctorDto): Promise<Doctor> {
    await validateUniqueness(this.doctorRepository, {
      email: dto.email,
      phone: dto.phone,
    });
    const doctor = await this.buildDoctor(dto);
    this.logger.log(`Doctor with ID ${doctor.id} created successfully.`);
    return handleDb(() => this.doctorRepository.save(doctor));
  }

  async findAll(filter?: FilterDoctorDto): Promise<Doctor[]> {
    const { DOCTOR, CLINIC, SERVICE } = QUERY_ALIASES;
    const query = this.doctorRepository
      .createQueryBuilder(DOCTOR)
      .leftJoinAndSelect(`${DOCTOR}.clinics`, CLINIC)
      .leftJoinAndSelect(`${DOCTOR}.services`, SERVICE);

    if (filter) {
      applyFilters(query, filter, DOCTOR);
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Doctor> {
    return findOrFail(this.doctorRepository, id, {
      relations: this.RELATIONS,
    });
  }

  async update(
    id: number,
    dto: UpdateDoctorDto,
    mode: 'put' | 'patch',
  ): Promise<Doctor> {
    const doctor = await findOrFail(this.doctorRepository, id, {
      relations: this.RELATIONS,
    });

    await validateUniqueness(
      this.doctorRepository,
      { email: dto.email, phone: dto.phone },
      id,
    );

    const cleanDto: Partial<Omit<UpdateDoctorDto, 'clinics' | 'services'>> = {
      ...dto,
    };

    updateEntityFields(doctor, cleanDto, mode, ['firstName', 'lastName']);

    const clinics = await resolveRelations(this.clinicRepository, dto.clinics);
    if (clinics !== undefined) doctor.clinics = clinics;

    const services = await resolveRelations(
      this.serviceRepository,
      dto.services,
    );
    if (services !== undefined) doctor.services = services;

    this.logger.log(`Doctor with ID ${id} updated via ${mode}.`);
    return handleDb(() => this.doctorRepository.save(doctor));
  }

  async delete(id: number): Promise<void> {
    const result = await this.doctorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Doctor with ID ${id} not found.`);
    }
    this.logger.log(`Doctor with ID ${id} deleted successfully.`);
  }

  private async buildDoctor(
    dto: CreateDoctorDto,
    doctor: Doctor = new Doctor(),
  ): Promise<Doctor> {
    const cleanDto: Partial<Omit<CreateDoctorDto, 'clinics' | 'services'>> = {
      ...dto,
    };

    buildEntity(doctor, cleanDto);

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
}
