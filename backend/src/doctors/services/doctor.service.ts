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
import {
  buildReposMap,
  cleanDto,
  compose,
  RepositoriesMap,
  setEntityRelations,
} from '../../shared/utils/entity/entity-composition.util';
import { updateEntityFields } from '../../shared/utils/entity/update-entity-fields.util';
import { getRelations } from '../../shared/utils/typeorm/relations.util';
import { getFilteredFields } from '../../shared/validators/get-required-fields.util';

@Injectable()
export class DoctorService {
  private readonly logger = new Logger(DoctorService.name);

  private readonly relations: (keyof CreateDoctorDto)[];

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

    this.reposByKey = buildReposMap<
      CreateDoctorDto,
      (typeof relationEntities)[number][]
    >(relationEntities, {
      clinicRepository: this.clinicRepository,
      serviceRepository: this.serviceRepository,
    });

    this.relations = getRelations(
      this.doctorRepository,
    ) as (keyof CreateDoctorDto)[];
  }

  async create(dto: CreateDoctorDto): Promise<Doctor> {
    await validateEntityUniqueness(
      this.doctorRepository,
      this.getCleanDto(dto),
    );

    const doctor = await this.composeDoctor(dto);

    await handleDb(() => this.doctorRepository.save(doctor));
    this.logger.log(`Doctor with ID ${doctor.id} created successfully.`);

    return await findOrFail(this.doctorRepository, doctor.id, {
      relations: this.relations,
    });
  }

  async findAll(dto?: FilterDoctorDto): Promise<Doctor[]> {
    const query = this.doctorRepository.createQueryBuilder('doctor');
    for (const relation of this.relations) {
      query.leftJoinAndSelect(`doctor.${relation}`, relation);
    }
    if (dto) {
      applyFilters(query, dto, 'doctor', this.relations);
    }
    return query.getMany();
  }

  async findOne(id: number): Promise<Doctor> {
    return findOrFail(this.doctorRepository, id, { relations: this.relations });
  }

  async update(
    id: number,
    dto: UpdateDoctorDto,
    mode: 'put' | 'patch',
  ): Promise<Doctor> {
    const doctor = await findOrFail(this.doctorRepository, id, {
      relations: this.relations,
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
      relations: this.relations,
    });
  }

  async delete(id: number): Promise<void> {
    await handleDb(() => this.doctorRepository.delete(id), {
      requireAffected: true,
    });
    this.logger.log(`Doctor with ID ${id} deleted successfully.`);
  }

  /**
   * Cleans the DTO by removing relational properties,
   * leaving only scalar fields.
   */
  private async composeDoctor(dto: CreateDoctorDto): Promise<Doctor> {
    return compose(
      Doctor,
      dto as unknown as Record<string, unknown>,
      this.relations,
      this.reposByKey,
    );
  }

  private getCleanDto<T extends CreateDoctorDto | UpdateDoctorDto>(
    dto: T,
  ): Omit<T, Extract<keyof T, keyof CreateDoctorDto>> {
    return cleanDto(
      dto,
      this.relations as Extract<keyof T, keyof CreateDoctorDto>[],
    );
  }

  private getFilteredFields(): Array<keyof CreateDoctorDto> {
    return getFilteredFields(CreateDoctorDto, this.relations);
  }

  private async setRelations<T extends CreateDoctorDto | UpdateDoctorDto>(
    doctor: Doctor,
    dto: T,
    mode: 'put' | 'patch',
  ): Promise<void> {
    await setEntityRelations(
      doctor,
      dto as unknown as Record<string, unknown>,
      this.relations,
      this.reposByKey,
      mode,
    );
  }
}
