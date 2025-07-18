import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '../entities/service.entity';
import { Repository } from 'typeorm';
import { ServiceCreateDto } from '../dto/service-create.dto';
import { ServiceUpdateDto } from '../dto/service-update.dto';
import { ServiceFilterDto } from '../dto/service-filter.dto';
import { findOrFail } from '../../shared/utils/typeorm/find-or-fail.util';
import { validateEntityUniqueness } from '../../shared/validators/validate-entity-uniqueness.util';
import {
  buildReposMap,
  cleanDto,
  compose,
  RepositoriesMap,
  setEntityRelations,
} from '../../shared/utils/entity/entity-composition.util';
import { getRelations } from '../../shared/utils/typeorm/relations.util';
import { SERVICE_NESTED_RELATIONS } from '../../shared/constants/relations.constants';
import { handleDb } from '../../shared/utils/db/handle-db.util';
import { applyFilters } from '../../shared/utils/query/apply-filters.util';
import { updateEntityFields } from '../../shared/utils/entity/update-entity-fields.util';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name);

  private readonly relationKeys: (keyof ServiceCreateDto)[];

  private readonly reposByKey: RepositoriesMap<ServiceCreateDto>;

  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {
    const relationEntities = [Doctor] as const;

    this.reposByKey = buildReposMap<
      ServiceCreateDto,
      (typeof relationEntities)[number][]
    >(relationEntities, {
      doctorRepository: this.doctorRepository,
    });

    this.relationKeys = getRelations(
      this.serviceRepository,
    ) as (keyof ServiceCreateDto)[];
  }

  async create(dto: ServiceCreateDto): Promise<Service> {
    await validateEntityUniqueness(
      this.serviceRepository,
      this.getCleanDto(dto),
    );

    const service = await this.composeService(dto);

    await handleDb(() => this.serviceRepository.save(service));
    this.logger.log(`Service with ID ${service.id} created successfully.`);

    return await findOrFail(this.serviceRepository, service.id, {
      relations: this.getServiceRelations(),
    });
  }

  async findAll(dto?: ServiceFilterDto): Promise<Service[]> {
    const query = this.serviceRepository.createQueryBuilder('service');

    for (const relation of this.relationKeys) {
      query.leftJoinAndSelect(`service.${relation}`, relation);
    }

    query.leftJoinAndSelect('doctors.clinics', 'clinics');

    if (dto) {
      applyFilters(query, dto, 'service', this.relationKeys, {
        clinicIds: 'clinics',
      });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Service> {
    return findOrFail(this.serviceRepository, id, {
      relations: this.getServiceRelations(),
    });
  }

  async update(
    id: number,
    dto: ServiceUpdateDto,
    mode: 'put' | 'patch',
  ): Promise<Service> {
    // Get the cleaned DTO without relational fields — for validation and updates
    const cleanDto = this.getCleanDto(dto);
    await validateEntityUniqueness(this.serviceRepository, cleanDto, id);

    const relations = this.getServiceRelations();
    const service = await findOrFail(this.serviceRepository, id, { relations });

    updateEntityFields(service, cleanDto, mode);

    await this.setRelations(service, dto);

    await handleDb(() => this.serviceRepository.save(service));
    this.logger.log(`Service with ID ${id} updated via ${mode}.`);

    return await findOrFail(this.serviceRepository, id, { relations });
  }

  async delete(id: number): Promise<void> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: this.relationKeys as string[],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }

    for (const relationKey of this.relationKeys) {
      if (Array.isArray(service[relationKey])) {
        (service[relationKey] as unknown) = [];
      }
    }

    await handleDb(() => this.serviceRepository.save(service));

    await handleDb(() => this.serviceRepository.remove(service));

    this.logger.log(`Service with ID ${id} deleted successfully.`);
  }

  /**
   * Cleans the DTO by removing relational properties,
   * leaving only scalar fields.
   */
  private async composeService<T extends ServiceCreateDto>(
    dto: T,
  ): Promise<Service> {
    return compose(Service, dto, this.relationKeys, this.reposByKey);
  }

  /**
   * Cleans the DTO by removing relational properties,
   * leaving only scalar fields.
   */
  private getCleanDto<T extends ServiceCreateDto | ServiceUpdateDto>(
    dto: T,
  ): Omit<T, Extract<keyof T, keyof ServiceCreateDto>> {
    return cleanDto(
      dto,
      this.relationKeys as Extract<keyof T, keyof ServiceCreateDto>[],
    );
  }

  private async setRelations<T extends ServiceCreateDto | ServiceUpdateDto>(
    service: Service,
    dto: T,
  ): Promise<void> {
    await setEntityRelations(service, dto, this.relationKeys, this.reposByKey);
  }

  private getServiceRelations(): string[] {
    return [...this.relationKeys, ...SERVICE_NESTED_RELATIONS] as string[];
  }
}
