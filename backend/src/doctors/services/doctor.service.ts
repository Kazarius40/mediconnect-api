import { Injectable, Logger } from '@nestjs/common';
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
import { getRelationProperties } from '../../shared/utils/decorators/relation-property.decorator';
import {
  buildReposMap,
  cleanDto,
  compose,
  getRequiredScalarFields,
  RepositoriesMap,
  setEntityRelations,
} from '../../shared/utils/entity/entity-composition.util';
import { updateEntityFields } from '../../shared/utils/entity/update-entity-fields.util';

@Injectable()
export class DoctorService {
  private readonly logger = new Logger(DoctorService.name);
  private readonly relationKeys = getRelationProperties(CreateDoctorDto);
  private readonly reposByKey: RepositoriesMap<CreateDoctorDto>;

  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,

    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,

    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {
    const relationEntities = [Clinic, Service] as const;

    this.reposByKey = buildReposMap(relationEntities, {
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

    await handleDb(() => this.doctorRepository.save(doctor));
    this.logger.log(`Doctor with ID ${doctor.id} created successfully.`);
    return await findOrFail(this.doctorRepository, doctor.id, {
      relations: this.relationKeys as string[],
    });
  }

  async findAll(dto?: FilterDoctorDto): Promise<Doctor[]> {
    const query = this.doctorRepository.createQueryBuilder('doctor');
    for (const relation of this.relationKeys) {
      query.leftJoinAndSelect(`doctor.${relation}`, relation as string);
    }
    if (dto) {
      applyFilters(query, dto, 'doctor', this.relationKeys as string[]);
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

    const requiredFields = this.getFilteredFields();

    updateEntityFields(
      doctor,
      cleanDto,
      mode,
      requiredFields as (keyof Doctor)[],
    );

    await this.setRelations(doctor, dto, mode);

    await handleDb(() => this.doctorRepository.save(doctor));
    this.logger.log(`Doctor with ID ${id} updated via ${mode}.`);

    return await findOrFail(this.doctorRepository, id, {
      relations: this.relationKeys as string[],
    });
  }

  async delete(id: number): Promise<void> {
    await handleDb(() => this.doctorRepository.delete(id), {
      requireAffected: true,
    });
    this.logger.log(`Doctor with ID ${id} deleted successfully.`);
  }

  /**
   * Composes a Doctor entity instance from the DTO,
   * resolving relations based on the relation keys.
   */
  private async composeDoctor(dto: CreateDoctorDto): Promise<Doctor> {
    return compose(Doctor, dto, this.relationKeys, this.reposByKey);
  }

  /**
   * Cleans the DTO by removing relational properties,
   * leaving only scalar fields.
   */
  private getCleanDto<T extends CreateDoctorDto | UpdateDoctorDto>(
    dto: T,
  ): Omit<T, (typeof this.relationKeys)[number]> {
    return cleanDto(dto, this.relationKeys);
  }

  /**
   * Returns an array of required scalar field keys
   * that must be considered during updates.
   */
  private getFilteredFields(): Array<keyof CreateDoctorDto> {
    return getRequiredScalarFields(CreateDoctorDto, this.relationKeys);
  }

  /**
   * Sets relational links on the Doctor entity
   * based on the provided DTO data.
   */
  private async setRelations<T extends CreateDoctorDto | UpdateDoctorDto>(
    doctor: Doctor,
    dto: T,
    mode: 'put' | 'patch',
  ): Promise<void> {
    await setEntityRelations(
      doctor,
      dto,
      this.relationKeys,
      this.reposByKey,
      mode,
    );
  }
}
