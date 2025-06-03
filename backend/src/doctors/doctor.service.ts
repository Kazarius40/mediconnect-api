import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { In, Repository } from 'typeorm';
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

  async create(dto: CreateDoctorDto): Promise<Doctor> {
    const doctor = await this.prepareDoctorEntity(dto);
    return this.doctorRepository.save(doctor);
  }

  async findAll(filter?: FilterDoctorDto): Promise<Doctor[]> {
    const { firstName, lastName, email, phone, sortBy, sortOrder } =
      filter || {};

    const query = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.clinics', 'clinic')
      .leftJoinAndSelect('doctor.services', 'service');

    if (firstName) {
      query.andWhere('doctor.firstName LIKE :firstName', {
        firstName: `%${firstName}%`,
      });
    }
    if (lastName) {
      query.andWhere('doctor.lastName LIKE :lastName', {
        lastName: `%${lastName}%`,
      });
    }
    if (email) {
      query.andWhere('doctor.email LIKE :email', { email: `%${email}%` });
    }
    if (phone) {
      query.andWhere('doctor.phone LIKE :phone', { phone: `%${phone}%` });
    }

    if (sortBy) {
      const orderDirection = sortOrder === 'DESC' ? 'DESC' : 'ASC';

      if (sortBy === 'firstName') {
        query.orderBy('doctor.firstName', orderDirection);
      } else if (sortBy === 'lastName') {
        query.orderBy('doctor.lastName', orderDirection);
      } else if (sortBy === 'email') {
        query.orderBy('doctor.email', orderDirection);
      } else if (sortBy === 'phone') {
        query.orderBy('doctor.phone', orderDirection);
      }
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['clinics', 'services'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    return doctor;
  }

  async update(id: number, dto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    const updatedDoctor = await this.prepareDoctorEntity(dto, doctor);
    return this.doctorRepository.save(updatedDoctor);
  }

  async remove(id: number): Promise<void> {
    const doctor = await this.findOne(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    await this.doctorRepository.remove(doctor);
  }

  private async prepareDoctorEntity(
    dto: CreateDoctorDto | UpdateDoctorDto,
    doctor: Doctor = new Doctor(),
  ): Promise<Doctor> {
    doctor.firstName = dto.firstName ?? doctor.firstName;
    doctor.lastName = dto.lastName ?? doctor.lastName;
    doctor.email = dto.email ?? doctor.email;
    doctor.phone = dto.phone ?? doctor.phone;

    if (dto.clinics !== undefined) {
      if (dto.clinics.length) {
        doctor.clinics = await this.clinicRepository.findBy({
          id: In(dto.clinics),
        });
      } else {
        doctor.clinics = [];
      }
    }

    if (dto.services !== undefined) {
      if (dto.services.length) {
        doctor.services = await this.serviceRepository.findBy({
          id: In(dto.services),
        });
      } else {
        doctor.services = [];
      }
    }

    return doctor;
  }
}
