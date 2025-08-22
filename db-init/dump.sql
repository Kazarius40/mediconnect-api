-- MySQL dump 10.13  Distrib 8.4.5, for Linux (x86_64)
--
-- Host: localhost    Database: mediconnect
-- ------------------------------------------------------
-- Server version	8.4.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Details structure for table `clinic`
--

DROP TABLE IF EXISTS `clinic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_b3df084998059e1f2f31bfd1e8` (`phone`),
  UNIQUE KEY `IDX_050033b437380ba808c041fe73` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinic`
--

LOCK TABLES `clinic` WRITE;
/*!40000 ALTER TABLE `clinic` DISABLE KEYS */;
INSERT INTO `clinic` VALUES (1,'Kyiv Vertebrology Clinic','Khreshchatyk St, 24, Kyiv','+380441234567','vertebro@clinic.ua','2025-06-05 22:01:40.816195','2025-06-05 22:01:40.816195'),(2,'Kyiv General Clinic','Borshchahivska St, 154, Kyiv','+380447654321','general@clinic.ua','2025-06-05 22:02:02.676892','2025-06-05 22:02:02.676892'),(3,'Kyiv Dental Clinic','Lypky St, 10, Kyiv','+380449876543','dental@clinic.ua','2025-06-05 22:02:32.889128','2025-06-05 22:02:32.889128'),(5,'Odesa Eye Clinic','Deribasivska St, 5, Odesa','+380487890123','eye@clinic.ua','2025-06-05 22:02:52.745942','2025-06-05 22:02:52.745942'),(6,'Kharkiv Pediatric Hospital','Sumska St, 3, Kharkiv','+380577651234','pediatric@clinic.ua','2025-06-05 22:03:02.224155','2025-06-05 22:03:02.224155'),(7,'Dnipro Traumatology Center','Dmitry Yavornytsky Ave, 20, Dnipro','+380567123457','trauma@clinic.ua','2025-06-05 22:03:10.196831','2025-07-16 16:19:15.000000'),(8,'Zaporizhzhia Rehabilitation Clinic','Sobornyi Ave, 8, Zaporizhzhia','+380612789012','rehab@clinic.ua','2025-06-05 22:03:18.139330','2025-06-05 22:03:18.139330'),(9,'Vinnytsia Diagnostic Center','Pyrohov St, 1, Vinnytsia','+380432678901','diagnostic@clinic.ua','2025-06-05 22:03:25.949669','2025-06-05 22:03:25.949669'),(10,'Poltava Family Medicine Clinic','Kotlyarevskogo St, 10, Poltava','+380532567890','family@clinic.ua','2025-06-05 22:03:34.963538','2025-06-05 22:03:34.963538'),(13,'Healthy Paws Clinica','124 Main St, Anytown','+380671244567',NULL,'2025-07-04 21:23:20.721299','2025-07-16 16:53:33.000000');
/*!40000 ALTER TABLE `clinic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Details structure for table `clinic_doctors_doctor`
--

DROP TABLE IF EXISTS `clinic_doctors_doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinic_doctors_doctor` (
  `clinicId` int NOT NULL,
  `doctorId` int NOT NULL,
  PRIMARY KEY (`clinicId`,`doctorId`),
  KEY `IDX_9eb54900314b95fdf7b5cd601e` (`clinicId`),
  KEY `IDX_16baca4a1d55c887b503004ade` (`doctorId`),
  CONSTRAINT `FK_16baca4a1d55c887b503004ade9` FOREIGN KEY (`doctorId`) REFERENCES `doctor` (`id`),
  CONSTRAINT `FK_9eb54900314b95fdf7b5cd601e9` FOREIGN KEY (`clinicId`) REFERENCES `clinic` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinic_doctors_doctor`
--

LOCK TABLES `clinic_doctors_doctor` WRITE;
/*!40000 ALTER TABLE `clinic_doctors_doctor` DISABLE KEYS */;
INSERT INTO `clinic_doctors_doctor` VALUES (1,5),(1,9),(2,1),(2,8),(2,10),(2,12),(2,13),(2,15),(3,6),(3,9),(3,11),(5,6),(5,7),(5,10),(5,12),(8,13),(8,15),(13,7);
/*!40000 ALTER TABLE `clinic_doctors_doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Details structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_bf6303ac911efaab681dc911f5` (`email`),
  UNIQUE KEY `IDX_a69863cded89c459b5898b9235` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (1,'Oleksandr','Shevchenko','oleksandr.shevchenko@example.com','+380679876549','2025-06-05 22:51:28.021084','2025-07-16 15:43:21.000000'),(5,'Elijah','Moore','elijah.moore@clinic-mail.com','+380687778899','2025-06-05 22:52:13.019457','2025-06-05 22:52:13.019457'),(6,'Charlotte','Taylor','charlotte.taylor@clinic-mail.com','+380962221100','2025-06-05 22:52:21.524471','2025-06-05 22:52:21.524471'),(7,'James','Harris','james.harris@clinic-mail.com','+380973334455','2025-06-05 22:52:32.017311','2025-06-05 22:52:32.017311'),(8,'Ava','Clark','ava.clark@clinic-mail.com','+380635556677','2025-06-05 22:52:40.662118','2025-06-05 22:52:40.662118'),(9,'Benjamin','Lewis','benjamin.lewis@clinic-mail.com','+380668889900','2025-06-05 22:52:50.648419','2025-06-05 22:52:50.648419'),(10,'Sophia','Robinson','sophia.robinson@clinic-mail.com','+380991112233','2025-06-05 22:52:59.896426','2025-06-05 22:52:59.896426'),(11,'Lucas','Walker','lucas.walker@clinic-mail.com','+380674445566','2025-06-05 22:53:09.372564','2025-06-05 22:53:09.372564'),(12,'Mia','Young','mia.young@clinic-mail.com','+380937778899','2025-06-05 22:53:19.085471','2025-06-05 22:53:19.085471'),(13,'Henri','Allen','henry.allen@clinic-mail.com','+380501012024','2025-06-05 22:53:29.213987','2025-07-16 20:39:00.000000'),(15,'Alexander','King','alexander.king@clinic-mail.com','+380955056067','2025-06-05 22:53:44.246059','2025-06-05 22:53:44.246059'),(19,'John','Doe','john.doe.{{randomInt}}@example.com','+380501234567','2025-07-03 14:05:04.507917','2025-07-03 14:05:04.507917'),(20,'Jane','Smith','john.doe.12345@example.com','+380501234569','2025-07-03 14:07:30.832957','2025-07-03 14:07:30.832957');
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Details structure for table `doctor_services_service`
--

DROP TABLE IF EXISTS `doctor_services_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_services_service` (
  `doctorId` int NOT NULL,
  `serviceId` int NOT NULL,
  PRIMARY KEY (`doctorId`,`serviceId`),
  KEY `IDX_6a33991fca20b84269dc0ca32d` (`doctorId`),
  KEY `IDX_6ad06b4880e3af4c6f0d0cf693` (`serviceId`),
  CONSTRAINT `FK_6a33991fca20b84269dc0ca32dd` FOREIGN KEY (`doctorId`) REFERENCES `doctor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_6ad06b4880e3af4c6f0d0cf6930` FOREIGN KEY (`serviceId`) REFERENCES `service` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_services_service`
--

LOCK TABLES `doctor_services_service` WRITE;
/*!40000 ALTER TABLE `doctor_services_service` DISABLE KEYS */;
INSERT INTO `doctor_services_service` VALUES (1,10),(5,3),(5,6),(5,8),(6,1),(6,4),(6,7),(6,10),(7,5),(7,8),(7,9),(8,3),(8,6),(8,10),(9,1),(9,4),(9,7),(9,9),(10,5),(10,8),(10,10),(11,3),(11,6),(12,1),(12,4),(12,8),(13,5),(13,10),(15,1),(15,4),(15,7),(15,10);
/*!40000 ALTER TABLE `doctor_services_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Details structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,1749158089098,'InitialMigration1749158089098'),(2,1749169558801,'FirstMigration1749169558801'),(3,1749170078944,' вduoMigration1749170078944'),(4,1749171403412,' ÐdritteMigration1749171403412'),(5,1750795571928,'NewOptimisation1750795571928'),(6,1751026472746,'AddFieldsToDoctors1751026472746'),(7,1752573790992,'MyMigration21752573790992');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Details structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_7806a14d42c3244064b4a1706c` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES (1,'Vertebrology Consultation','Initial consultation with a vertebrologist.','2025-06-05 22:06:18.930436','2025-06-05 22:06:18.930436'),(3,'Dental Check-up','Routine dental examination and cleaning.','2025-06-05 22:06:37.834702','2025-06-05 22:06:37.834702'),(4,'Cardiology Consultation','Consultation for heart-related issues.','2025-06-05 22:06:52.018645','2025-06-05 22:06:52.018645'),(5,'Ophthalmology Diagnosis','Eye examination and diagnosis of vision problems.','2025-06-05 22:07:03.386098','2025-06-05 22:07:03.386098'),(6,'Pediatric Vaccination','Vaccination services for children.','2025-06-05 22:07:15.181811','2025-06-05 22:07:15.181811'),(7,'Traumatology First Aid','Emergency care for injuries and traumas.','2025-06-05 22:07:22.480069','2025-06-05 22:07:22.480069'),(8,'Physical Rehabilitation','Post-injury or post-surgery physical therapy.','2025-06-05 22:07:30.468458','2025-06-05 22:07:30.468458'),(9,'Laboratory Diagnostics','Various laboratory tests and analyses.','2025-06-05 22:07:41.013289','2025-06-05 22:07:41.013289'),(10,'Family Doctor Visit','General consultation with a family physician.','2025-06-05 22:07:51.445903','2025-06-05 22:07:51.445903');
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Details structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `refreshToken` varchar(255) NOT NULL,
  `accessTokenExpiresAt` datetime NOT NULL,
  `refreshTokenExpiresAt` datetime NOT NULL,
  `isBlocked` tinyint NOT NULL DEFAULT '0',
  `jti` varchar(255) NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_94f168faad896c0786646fa3d4a` (`userId`),
  CONSTRAINT `FK_94f168faad896c0786646fa3d4a` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=189 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (186,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImp0aSI6InZncWlieGp3dGxybWQ2ZnJmbm8iLCJpYXQiOjE3NTI2OTkwNTEsImV4cCI6MTc1Mjc4NTQ1MX0.uGytigEUsL0gHpWH2OxdFGBq55oXG8whocYOdC2fsqU','2025-07-16 22:55:52','2025-07-17 22:50:52',1,'vgqibxjwtlrmd6frfno',1),(187,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImp0aSI6IjlvZjAxM3F0OGM1bWQ2Z2I4NTAiLCJpYXQiOjE3NTI2OTk5NzUsImV4cCI6MTc1Mjc4NjM3NX0.atSy9D6uM99n5PBs2HNjGl5P1sVO5dtlPUA8T4YJuJI','2025-07-16 23:11:15','2025-07-17 23:06:15',1,'9of013qt8c5md6gb850',1),(188,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImp0aSI6InBocWF2c3o2ZzVtZDZndGUyMCIsImlhdCI6MTc1MjcwMDgyMiwiZXhwIjoxNzUyNzg3MjIyfQ._AhTCDk85RbEjlZcDsKFgPc7QQ6pt4aAbjZ0nuW-LLk','2025-07-16 21:25:23','2025-07-17 21:20:23',0,'phqavsz6g5md6gte20',1);
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Details structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','DOCTOR','PATIENT') NOT NULL DEFAULT 'PATIENT',
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` timestamp NULL DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  UNIQUE KEY `IDX_8e1f623798118e629b46a9e629` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'test@example.com','$2b$10$Sv5hN/aL5VrlUZbReCc75usf3LX2cneWScM0vnqYBJdNrEFH5Li.i','ADMIN','Oleg','Frolovchyk',NULL,NULL,NULL,'2025-06-05 21:21:45.709375','2025-07-10 03:46:59.000000'),(2,'test3@example.com','$2b$10$QhJbTfdvBPDd8ZqnYh01yOoeKFI7rZwyst.ohPfHaySNQGCldiLYi','DOCTOR','Vasyaa','Korob','+380673334454',NULL,NULL,'2025-06-05 23:27:50.900210','2025-07-16 21:06:03.000000'),(3,'test4@example.com','$2b$10$QhJbTfdvBPDd8ZqnYh01yOoeKFI7rZwyst.ohPfHaySNQGCldiLYi','DOCTOR','Petya','Petrov','+380673334455',NULL,NULL,'2025-06-06 00:43:58.860106','2025-07-05 08:19:37.000000'),(5,'user@example.com','$2b$10$boLc..WxQUml/4T/SvErSOHn.i8smludGI6WoYusJ4ya4nosDksq2','PATIENT','Johqn','Doeeeee','+380345678292',NULL,NULL,'2025-07-04 22:16:53.577796','2025-07-04 22:39:43.000000'),(9,'test22@gmail.com','$2b$10$rQag3BxsIPqYaZDPbJElj.jx763ltye4Na3DRfbe78io7FcfBcBfO','PATIENT',NULL,NULL,NULL,NULL,NULL,'2025-07-16 15:55:35.484921','2025-07-16 15:55:35.484921');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-16 21:23:41
