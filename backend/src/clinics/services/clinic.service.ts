import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from '../entities/clinic.entity';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { UpdateClinicDto } from '../dto/update-clinic.dto';
import { FilterClinicDto } from '../dto/filter-clinic.dto';
import { findOrFail } from 'src/shared/utils/typeorm/find-or-fail.util';
import { validateEntityUniqueness } from '../../shared/validators/validate-entity-uniqueness.util';
import {
  buildReposMap,
  cleanDto,
  compose,
  RepositoriesMap,
} from '../../shared/utils/entity/entity-composition.util';
import { handleDb } from 'src/shared/utils/db/handle-db.util';
import { applyFilters } from '../../shared/utils/query/apply-filters.util';
import { getRelations } from '../../shared/utils/typeorm/relations.util';
import { CLINIC_NESTED_RELATIONS } from '../../shared/constants/relations.constants';

@Injectable()
export class ClinicService {
  private readonly logger = new Logger(ClinicService.name);

  private readonly reposByKey: RepositoriesMap<CreateClinicDto>;

  constructor(
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,
  ) {
    const relationEntities: [] = [] as const;
    this.reposByKey = buildReposMap<
      CreateClinicDto,
      (typeof relationEntities)[number][]
    >(relationEntities, {});
  }

  async create(dto: CreateClinicDto): Promise<Clinic> {
    await validateEntityUniqueness(
      this.clinicRepository,
      this.getCleanDto(dto),
    );

    const clinic = await this.composeClinic(dto);

    await handleDb(() => this.clinicRepository.save(clinic));
    this.logger.log(`Clinic with ID ${clinic.id} created successfully.`);

    const relations = getRelations(this.clinicRepository, [
      ...CLINIC_NESTED_RELATIONS,
    ]);
    return await findOrFail(this.clinicRepository, clinic.id, { relations });
  }

  async findAll(dto?: FilterClinicDto): Promise<Clinic[]> {
    const relations = getRelations(this.clinicRepository, [
      ...CLINIC_NESTED_RELATIONS,
    ]);

    const query = this.clinicRepository.createQueryBuilder('clinic');
    for (const relation of relations) {
      query.leftJoinAndSelect(`clinic.${relation}`, relation);
    }
    if (dto) {
      applyFilters(query, dto, 'clinic', relations);
    }
    return query.getMany();
  }

  async findOne(id: number): Promise<Clinic> {
    const relations = getRelations(this.clinicRepository, [
      ...CLINIC_NESTED_RELATIONS,
    ]);
    return findOrFail(this.clinicRepository, id, { relations });
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

  private async composeClinic(dto: CreateClinicDto): Promise<Clinic> {
    return compose(
      Clinic,
      dto as unknown as Record<string, unknown>,
      this.relationKeys,
      this.reposByKey,
    );
  }

  /**
   * Cleans the DTO by removing relational properties,
   * leaving only scalar fields.
   */
  private getCleanDto<T extends CreateClinicDto | UpdateClinicDto>(
    dto: T,
  ): Omit<T, Extract<keyof T, keyof CreateClinicDto>> {
    return cleanDto(
      dto as unknown as Record<string, unknown>,
      this.relationKeys as Extract<keyof T, keyof CreateClinicDto>[],
    ) as Omit<T, Extract<keyof T, keyof CreateClinicDto>>;
  }
}
