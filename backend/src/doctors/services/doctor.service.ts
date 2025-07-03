import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from '../entities/doctor.entity';
import { Repository } from 'typeorm';
import { Clinic } from 'src/clinics/entities/clinic.entity';
import { Service } from 'src/services/entities/service.entity';
import { DoctorFilterDto } from '../dto/doctor-filter.dto';
import { DoctorCreateDto } from '../dto/doctor-create.dto';
import { DoctorUpdateDto } from '../dto/doctor-update';
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
import { DOCTOR_NESTED_RELATIONS } from '../../shared/constants/relations.constants';

@Injectable()
export class DoctorService {
  private readonly logger = new Logger(DoctorService.name);

  private readonly relationKeys: (keyof DoctorCreateDto)[];

  private readonly reposByKey: RepositoriesMap<DoctorCreateDto>;

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
      DoctorCreateDto,
      (typeof relationEntities)[number][]
    >(relationEntities, {
      clinicRepository: this.clinicRepository,
      serviceRepository: this.serviceRepository,
    });

    this.relationKeys = getRelations(
      this.doctorRepository,
    ) as (keyof DoctorCreateDto)[];
  }

  async create(dto: DoctorCreateDto): Promise<Doctor> {
    await validateEntityUniqueness(
      this.doctorRepository,
      this.getCleanDto(dto),
    );

    const doctor = await this.composeDoctor(dto);

    await handleDb(() => this.doctorRepository.save(doctor));
    this.logger.log(`Doctor with ID ${doctor.id} created successfully.`);

    return await findOrFail(this.doctorRepository, doctor.id, {
      relations: this.getDoctorRelations(),
    });
  }

  async findAll(dto?: DoctorFilterDto): Promise<Doctor[]> {
    const relations = this.getDoctorRelations();

    const query = this.doctorRepository.createQueryBuilder('doctor');
    for (const relation of relations) {
      query.leftJoinAndSelect(`doctor.${relation}`, relation);
    }

    if (dto) {
      applyFilters(query, dto, 'doctor', relations);
    }
    return query.getMany();
  }

  async findOne(id: number): Promise<Doctor> {
    return findOrFail(this.doctorRepository, id, {
      relations: this.getDoctorRelations(),
    });
  }

  async update(
    id: number,
    dto: DoctorUpdateDto,
    mode: 'put' | 'patch',
  ): Promise<Doctor> {
    const relations = this.getDoctorRelations();

    const doctor = await findOrFail(this.doctorRepository, id, { relations });

    const cleanDto = this.getCleanDto(dto);

    const requiredFields = this.getRequiredFields();

    updateEntityFields(
      doctor,
      cleanDto,
      mode,
      requiredFields as (keyof Doctor)[],
    );

    await this.setRelations(doctor, dto, mode);

    await handleDb(() => this.doctorRepository.save(doctor));
    this.logger.log(`Doctor with ID ${id} updated via ${mode}.`);

    return await findOrFail(this.doctorRepository, id, { relations });
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
  private async composeDoctor<T extends DoctorCreateDto>(
    dto: T,
  ): Promise<Doctor> {
    return compose(Doctor, dto, this.relationKeys, this.reposByKey);
  }

  /**
   * Cleans the DTO by removing relational properties,
   * leaving only scalar fields.
   */
  private getCleanDto<T extends DoctorCreateDto | DoctorUpdateDto>(
    dto: T,
  ): Omit<T, Extract<keyof T, keyof DoctorCreateDto>> {
    return cleanDto(
      dto,
      this.relationKeys as Extract<keyof T, keyof DoctorCreateDto>[],
    );
  }

  private getRequiredFields(): Array<keyof DoctorCreateDto> {
    return getFilteredFields(DoctorCreateDto, this.relationKeys);
  }

  private async setRelations<T extends DoctorCreateDto | DoctorUpdateDto>(
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

  private getDoctorRelations(): string[] {
    return [...this.relationKeys, ...DOCTOR_NESTED_RELATIONS] as string[];
  }
}
