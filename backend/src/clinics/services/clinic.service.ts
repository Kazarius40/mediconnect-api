import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from '../entities/clinic.entity';
import { ClinicCreateDto } from '../dto/clinic-create.dto';
import { ClinicUpdateDto } from '../dto/clinic-update.dto';
import { ClinicFilterDto } from '../dto/clinic-filter.dto';
import { findOrFail } from 'src/shared/utils/typeorm/find-or-fail.util';
import { validateEntityUniqueness } from '../../shared/validators/validate-entity-uniqueness.util';
import {
  buildReposMap,
  cleanDto,
  compose,
  RepositoriesMap,
  setEntityRelations,
} from '../../shared/utils/entity/entity-composition.util';
import { handleDb } from 'src/shared/utils/db/handle-db.util';
import { applyFilters } from '../../shared/utils/query/apply-filters.util';
import { getRelations } from '../../shared/utils/typeorm/relations.util';
import { CLINIC_NESTED_RELATIONS } from '../../shared/constants/relations.constants';
import { updateEntityFields } from 'src/shared/utils/entity/update-entity-fields.util';
import { getFilteredFields } from 'src/shared/validators/get-required-fields.util';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Injectable()
export class ClinicService {
  private readonly logger = new Logger(ClinicService.name);

  private readonly relationKeys: (keyof ClinicCreateDto)[];

  private readonly reposByKey: RepositoriesMap<ClinicCreateDto>;

  constructor(
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {
    const relationEntities = [Doctor] as const;

    this.reposByKey = buildReposMap<
      ClinicCreateDto,
      (typeof relationEntities)[number][]
    >(relationEntities, {
      doctorRepository: this.doctorRepository,
    });

    this.relationKeys = getRelations(
      this.clinicRepository,
    ) as (keyof ClinicCreateDto)[];
  }

  async create(dto: ClinicCreateDto): Promise<Clinic> {
    await validateEntityUniqueness(
      this.clinicRepository,
      this.getCleanDto(dto),
    );

    const clinic = await this.composeClinic(dto);

    await handleDb(() => this.clinicRepository.save(clinic));
    this.logger.log(`Clinic with ID ${clinic.id} created successfully.`);

    return await findOrFail(this.clinicRepository, clinic.id, {
      relations: this.getClinicRelations(),
    });
  }

  async findAll(dto?: ClinicFilterDto): Promise<Clinic[]> {
    const query = this.clinicRepository.createQueryBuilder('clinic');

    for (const relation of this.relationKeys) {
      query.leftJoinAndSelect(`clinic.${relation}`, relation);
    }

    query.leftJoinAndSelect('doctors.services', 'services');

    if (dto) {
      applyFilters(query, dto, 'clinic', this.relationKeys, {
        serviceIds: 'services',
      });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Clinic> {
    return findOrFail(this.clinicRepository, id, {
      relations: this.getClinicRelations(),
    });
  }

  async update(
    id: number,
    dto: ClinicUpdateDto,
    mode: 'put' | 'patch',
  ): Promise<Clinic> {
    const relations = this.getClinicRelations();

    const clinic = await findOrFail(this.clinicRepository, id, { relations });

    const cleanDto = this.getCleanDto(dto);

    const requiredFields = this.getRequiredFields();

    updateEntityFields(
      clinic,
      cleanDto,
      mode,
      requiredFields as (keyof Clinic)[],
    );

    await this.setRelations(clinic, dto, mode);

    await handleDb(() => this.clinicRepository.save(clinic));
    this.logger.log(`Clinic with ID ${id} updated via ${mode}.`);

    return await findOrFail(this.clinicRepository, id, { relations });
  }

  async delete(id: number): Promise<void> {
    await handleDb(() => this.clinicRepository.delete(id), {
      requireAffected: true,
    });
    this.logger.log(`Clinic with ID ${id} deleted successfully.`);
  }

  /**
   * Cleans the DTO by removing relational properties,
   * leaving only scalar fields.
   */
  private async composeClinic<T extends ClinicCreateDto>(
    dto: T,
  ): Promise<Clinic> {
    return compose(Clinic, dto, this.relationKeys, this.reposByKey);
  }

  /**
   * Cleans the DTO by removing relational properties,
   * leaving only scalar fields.
   */
  private getCleanDto<T extends ClinicCreateDto | ClinicUpdateDto>(
    dto: T,
  ): Omit<T, Extract<keyof T, keyof ClinicCreateDto>> {
    return cleanDto(
      dto,
      this.relationKeys as Extract<keyof T, keyof ClinicCreateDto>[],
    );
  }

  private getRequiredFields(): Array<keyof ClinicCreateDto> {
    return getFilteredFields(ClinicCreateDto, this.relationKeys);
  }

  private async setRelations<T extends ClinicCreateDto | ClinicUpdateDto>(
    clinic: Clinic,
    dto: T,
    mode: 'put' | 'patch',
  ): Promise<void> {
    await setEntityRelations(
      clinic,
      dto,
      this.relationKeys,
      this.reposByKey,
      mode,
    );
  }

  private getClinicRelations(): string[] {
    return [...this.relationKeys, ...CLINIC_NESTED_RELATIONS] as string[];
  }
}
