import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clinic } from './clinic.entity';
import { Repository } from 'typeorm';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { FilterClinicDto } from './dto/filter-clinic.dto';

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,
  ) {}

  async createClinic(dto: CreateClinicDto): Promise<Clinic> {
    const clinic = this.clinicRepository.create(dto);
    return this.clinicRepository.save(clinic);
  }

  async getAllClinics(filter?: FilterClinicDto): Promise<Clinic[]> {
    const { name, sortBy, serviceIds, doctorIds } = filter || {};

    const query = this.clinicRepository
      .createQueryBuilder('clinic')
      .leftJoinAndSelect('clinic.doctors', 'doctor')
      .leftJoinAndSelect('doctor.services', 'service');

    if (name) {
      query.where('clinic.name LIKE :name', { name: `%${name}%` });
    }

    if (serviceIds && serviceIds.length > 0) {
      query
        .innerJoin('clinic.doctors', 'filteredDoctor_service')
        .innerJoin('filteredDoctor_service.services', 'filteredService')
        .andWhere('filteredService.id IN (:...serviceIds)', { serviceIds })
        .distinct(true);
    }

    if (doctorIds && doctorIds.length > 0) {
      query
        .innerJoin('clinic.doctors', 'filteredDoctor_doctor')
        .andWhere('filteredDoctor_doctor.id IN (:...doctorIds)', { doctorIds })
        .distinct(true);
    }

    if (sortBy === 'name') {
      query.orderBy('clinic.name', 'ASC');
    }

    return query.getMany();
  }

  async getClinicById(id: number): Promise<Clinic> {
    const clinic = await this.clinicRepository.findOne({
      where: { id },
      relations: ['doctors', 'doctors.services'],
    });
    if (!clinic) throw new NotFoundException('Clinic not found');
    return clinic;
  }

  async deleteClinic(id: number): Promise<void> {
    const result = await this.clinicRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }
  }
}
