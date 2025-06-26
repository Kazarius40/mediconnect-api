import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from '../entities/doctor.entity';
import { Repository } from 'typeorm';
import { Clinic } from 'src/clinics/entities/clinic.entity';
import { Service } from 'src/services/entities/service.entity';
import { FilterDoctorDto } from '../dto/filter-doctor.dto';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor';
import { validateEntityUniqueness } from '../../shared/validators/validate-entity-uniqueness.util';
import { findOrFail } from '../../shared/utils/typeorm/find-or-fail.util';
import { applyFilters } from '../../shared/utils/query/apply-filters.util';
import { handleDb } from '../../shared/utils/db/handle-db.util';
import { updateEntityFields } from '../../shared/utils/entity/update-entity-fields.util';
import { getRelationProperties } from '../../shared/utils/decorators/relation-property.decorator';
import {
  buildRelationRepositoriesMap,
  composeEntity,
  getDtoWithoutRelations,
  getRequiredScalarFields,
  RepositoriesMap,
  setEntityRelations,
} from '../../shared/utils/entity/entity-composition.util';

@Injectable()
export class DoctorService {
  private readonly logger = new Logger(DoctorService.name);
  private readonly relationKeys = getRelationProperties(CreateDoctorDto);
  private readonly reposByKey: RepositoriesMap<CreateDoctorDto>;

  @InjectRepository(Doctor)
  private readonly doctorRepository: Repository<Doctor>;

  @InjectRepository(Clinic)
  private readonly clinicRepository: Repository<Clinic>;

  @InjectRepository(Service)
  private readonly serviceRepository: Repository<Service>;

  constructor() {
    const relationEntities = [Clinic, Service] as const;

    this.reposByKey = buildRelationRepositoriesMap(relationEntities, {
      clinicRepository: this.clinicRepository,
      serviceRepository: this.serviceRepository,
    });
  }

  async create(dto: CreateDoctorDto): Promise<Doctor> {
    const doctor = await this.composeDoctor(dto);
    await validateEntityUniqueness(
      this.doctorRepository,
      this.getCleanDto(dto),
    );
    this.logger.log(`Doctor with ID ${doctor.id} created successfully.`);
    return handleDb(() => this.doctorRepository.save(doctor));
  }

  async findAll(dto?: FilterDoctorDto): Promise<Doctor[]> {
    const query = this.doctorRepository.createQueryBuilder('doctor');

    for (const relation of this.relationKeys) {
      query.leftJoinAndSelect(`doctor.${relation}`, relation as string);
    }

    if (dto) {
      applyFilters(query, dto, 'doctor');
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Doctor> {
    return findOrFail(this.doctorRepository, id, {
      relations: this.relationKeys as string[],
    });
  }

  async update(
    id: number,
    dto: UpdateDoctorDto,
    mode: 'put' | 'patch',
  ): Promise<Doctor> {
    const doctor = await findOrFail(this.doctorRepository, id, {
      relations: this.relationKeys as string[],
    });

    const cleanDto = this.getCleanDto(dto);
    await validateEntityUniqueness(this.doctorRepository, cleanDto, id);

    const requiredFields = this.getRequiredNonRelationFields();
    updateEntityFields(
      doctor,
      cleanDto,
      mode,
      requiredFields as (keyof Doctor)[],
    );

    await this.setRelations(doctor, dto);

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

  private async composeDoctor(dto: CreateDoctorDto): Promise<Doctor> {
    return composeEntity(Doctor, dto, this.relationKeys, this.reposByKey);
  }

  private getCleanDto<T extends CreateDoctorDto | UpdateDoctorDto>(
    dto: T,
  ): Omit<T, (typeof this.relationKeys)[number]> {
    return getDtoWithoutRelations(dto, this.relationKeys);
  }

  private getRequiredNonRelationFields(): Array<keyof CreateDoctorDto> {
    return getRequiredScalarFields(CreateDoctorDto, this.relationKeys);
  }

  private async setRelations<T extends CreateDoctorDto | UpdateDoctorDto>(
    doctor: Doctor,
    dto: T,
  ): Promise<void> {
    await setEntityRelations(doctor, dto, this.relationKeys, this.reposByKey);
  }
}
