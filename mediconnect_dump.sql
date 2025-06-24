-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: nozomi.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `clinic`
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinic`
--

LOCK TABLES `clinic` WRITE;
/*!40000 ALTER TABLE `clinic` DISABLE KEYS */;
INSERT INTO `clinic` VALUES (1,'Kyiv Vertebrology Clinic','Khreshchatyk St, 24, Kyiv','+380441234567','vertebro@clinic.ua','2025-06-05 22:01:40.816195','2025-06-05 22:01:40.816195'),(2,'Kyiv General Clinic','Borshchahivska St, 154, Kyiv','+380447654321','general@clinic.ua','2025-06-05 22:02:02.676892','2025-06-05 22:02:02.676892'),(3,'Kyiv Dental Clinic','Lypky St, 10, Kyiv','+380449876543','dental@clinic.ua','2025-06-05 22:02:32.889128','2025-06-05 22:02:32.889128'),(4,'Lviv Cardiocenter','Shevchenko Ave, 1, Lviv','+380322345678','cardio@clinic.ua','2025-06-05 22:02:43.970185','2025-06-05 22:02:43.970185'),(5,'Odesa Eye Clinic','Deribasivska St, 5, Odesa','+380487890123','eye@clinic.ua','2025-06-05 22:02:52.745942','2025-06-05 22:02:52.745942'),(6,'Kharkiv Pediatric Hospital','Sumska St, 3, Kharkiv','+380577651234','pediatric@clinic.ua','2025-06-05 22:03:02.224155','2025-06-05 22:03:02.224155'),(7,'Dnipro Traumatology Center','Dmitry Yavornytsky Ave, 20, Dnipro','+380567123456','trauma@clinic.ua','2025-06-05 22:03:10.196831','2025-06-05 22:03:10.196831'),(8,'Zaporizhzhia Rehabilitation Clinic','Sobornyi Ave, 8, Zaporizhzhia','+380612789012','rehab@clinic.ua','2025-06-05 22:03:18.139330','2025-06-05 22:03:18.139330'),(9,'Vinnytsia Diagnostic Center','Pyrohov St, 1, Vinnytsia','+380432678901','diagnostic@clinic.ua','2025-06-05 22:03:25.949669','2025-06-05 22:03:25.949669'),(10,'Poltava Family Medicine Clinic','Kotlyarevskogo St, 10, Poltava','+380532567890','family@clinic.ua','2025-06-05 22:03:34.963538','2025-06-05 22:03:34.963538');
/*!40000 ALTER TABLE `clinic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clinic_doctors_doctor`
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
INSERT INTO `clinic_doctors_doctor` VALUES (1,3),(1,5),(1,7),(1,9),(1,11),(1,13),(1,15),(2,2),(2,3),(2,6),(2,8),(2,10),(2,12),(2,13),(3,4),(3,6),(3,9),(3,11),(3,14),(4,2),(4,5),(4,8),(4,9),(4,12),(4,15),(5,1),(5,2),(5,4),(5,6),(5,7),(5,10),(5,12),(5,14);
/*!40000 ALTER TABLE `clinic_doctors_doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (1,'Oleksandr','Shevchenko','oleksandr.shevchenko@example.com','+380679876548','2025-06-05 22:51:28.021084','2025-06-20 18:23:15.000000'),(2,'Olivia','Davis','olivia.davis@clinic-mail.com','+380679876543','2025-06-05 22:51:40.342332','2025-06-05 22:51:40.342332'),(3,'Noah','Anderson','noah.anderson@clinic-mail.com','+380931112233','2025-06-05 22:51:50.294539','2025-06-05 22:51:50.294539'),(4,'Emma','Wilson','emma.wilson@clinic-mail.com','+380954445566','2025-06-05 22:52:00.623090','2025-06-05 22:52:00.623090'),(5,'Elijah','Moore','elijah.moore@clinic-mail.com','+380687778899','2025-06-05 22:52:13.019457','2025-06-05 22:52:13.019457'),(6,'Charlotte','Taylor','charlotte.taylor@clinic-mail.com','+380962221100','2025-06-05 22:52:21.524471','2025-06-05 22:52:21.524471'),(7,'James','Harris','james.harris@clinic-mail.com','+380973334455','2025-06-05 22:52:32.017311','2025-06-05 22:52:32.017311'),(8,'Ava','Clark','ava.clark@clinic-mail.com','+380635556677','2025-06-05 22:52:40.662118','2025-06-05 22:52:40.662118'),(9,'Benjamin','Lewis','benjamin.lewis@clinic-mail.com','+380668889900','2025-06-05 22:52:50.648419','2025-06-05 22:52:50.648419'),(10,'Sophia','Robinson','sophia.robinson@clinic-mail.com','+380991112233','2025-06-05 22:52:59.896426','2025-06-05 22:52:59.896426'),(11,'Lucas','Walker','lucas.walker@clinic-mail.com','+380674445566','2025-06-05 22:53:09.372564','2025-06-05 22:53:09.372564'),(12,'Mia','Young','mia.young@clinic-mail.com','+380937778899','2025-06-05 22:53:19.085471','2025-06-05 22:53:19.085471'),(13,'Henry','Allen','henry.allen@clinic-mail.com','+380501012023','2025-06-05 22:53:29.213987','2025-06-05 22:53:29.213987'),(14,'Isabella','Wright','isabella.wright@clinic-mail.com','+380673034045','2025-06-05 22:53:37.285278','2025-06-05 22:53:37.285278'),(15,'Alexander','King','alexander.king@clinic-mail.com','+380955056067','2025-06-05 22:53:44.246059','2025-06-05 22:53:44.246059');
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_services_service`
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
INSERT INTO `doctor_services_service` VALUES (1,10),(2,1),(2,3),(2,6),(2,9),(3,4),(3,7),(3,10),(4,1),(4,2),(4,5),(4,7),(4,9),(5,3),(5,6),(5,8),(6,1),(6,4),(6,7),(6,10),(7,2),(7,5),(7,8),(7,9),(8,3),(8,6),(8,10),(9,1),(9,4),(9,7),(9,9),(10,2),(10,5),(10,8),(10,10),(11,3),(11,6),(11,9),(12,1),(12,4),(12,7),(12,8),(13,2),(13,5),(13,10),(14,3),(14,6),(14,9),(15,1),(15,4),(15,7),(15,10);
/*!40000 ALTER TABLE `doctor_services_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,1749158089098,'InitialMigration1749158089098'),(2,1749169558801,'FirstMigration1749169558801'),(3,1749170078944,' вduoMigration1749170078944'),(4,1749171403412,' ÐdritteMigration1749171403412'),(5,1750795571928,'NewOptimisation1750795571928');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service`
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES (1,'Vertebrology Consultation','Initial consultation with a vertebrologist.','2025-06-05 22:06:18.930436','2025-06-05 22:06:18.930436'),(2,'General Therapy','General medical examination and treatment.','2025-06-05 22:06:29.736605','2025-06-05 22:06:29.736605'),(3,'Dental Check-up','Routine dental examination and cleaning.','2025-06-05 22:06:37.834702','2025-06-05 22:06:37.834702'),(4,'Cardiology Consultation','Consultation for heart-related issues.','2025-06-05 22:06:52.018645','2025-06-05 22:06:52.018645'),(5,'Ophthalmology Diagnosis','Eye examination and diagnosis of vision problems.','2025-06-05 22:07:03.386098','2025-06-05 22:07:03.386098'),(6,'Pediatric Vaccination','Vaccination services for children.','2025-06-05 22:07:15.181811','2025-06-05 22:07:15.181811'),(7,'Traumatology First Aid','Emergency care for injuries and traumas.','2025-06-05 22:07:22.480069','2025-06-05 22:07:22.480069'),(8,'Physical Rehabilitation','Post-injury or post-surgery physical therapy.','2025-06-05 22:07:30.468458','2025-06-05 22:07:30.468458'),(9,'Laboratory Diagnostics','Various laboratory tests and analyses.','2025-06-05 22:07:41.013289','2025-06-05 22:07:41.013289'),(10,'Family Doctor Visit','General consultation with a family physician.','2025-06-05 22:07:51.445903','2025-06-05 22:07:51.445903');
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `accessToken` varchar(255) NOT NULL,
  `refreshToken` varchar(255) NOT NULL,
  `accessTokenExpiresAt` datetime NOT NULL,
  `refreshTokenExpiresAt` datetime NOT NULL,
  `isBlocked` tinyint NOT NULL DEFAULT '0',
  `jti` varchar(255) NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_94f168faad896c0786646fa3d4a` (`userId`),
  CONSTRAINT `FK_94f168faad896c0786646fa3d4a` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImp0aSI6IjNla2NnNXBidDg1bWJ3OHQwcHUiLCJpYXQiOjE3NDk5MDU5MjQsImV4cCI6MTc0OTkwOTUyNH0.gbQtIQIHkpeY8DujEaSuXz3ZOr6rr0MHg2ZZ71UHFXY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImp0aSI6IjNla2NnNXBidDg1bWJ3OHQwcHUiLCJpYXQiOjE3NDk5MDU5MjQsImV4cCI6MTc0OTk5MjMyNH0.XHMgsloRXLQqxwy3Am5SAzmp3cNFhP4TO9UoxNhqd0o','2025-06-14 13:58:44','2025-06-15 12:58:44',1,'3ekcg5pbt85mbw8t0pu',1),(10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoidGVzdDRAZXhhbXBsZS5jb20iLCJyb2xlIjoiUEFUSUVOVCIsImp0aSI6IjV6ZGMwbG9oMXdhbWM0bTRoa2siLCJpYXQiOjE3NTA0MTIwMjMsImV4cCI6MTc1MDQxNTYyM30.Ra6hw3aKJ-h3wSbmGmsmQ948s67nP-kZwejbu1X5Em0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoidGVzdDRAZXhhbXBsZS5jb20iLCJyb2xlIjoiUEFUSUVOVCIsImp0aSI6IjV6ZGMwbG9oMXdhbWM0bTRoa2siLCJpYXQiOjE3NTA0MTIwMjMsImV4cCI6MTc1MDQ5ODQyM30.SWJuakSIGSxSr81GNB85BVdyp5YUYmS_l7wTVnWeQeU','2025-06-20 10:33:44','2025-06-21 09:33:44',1,'5zdc0loh1wamc4m4hkk',3),(11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoidGVzdDRAZXhhbXBsZS5jb20iLCJyb2xlIjoiUEFUSUVOVCIsImp0aSI6IjhodWNraDNyM3FvbWM0bTUxOG0iLCJpYXQiOjE3NTA0MTIwNDksImV4cCI6MTc1MDQxNTY0OX0.0_ykRLmd2ZY_9uhM-Myq2hG70hiHcrnGOVCak392RVE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoidGVzdDRAZXhhbXBsZS5jb20iLCJyb2xlIjoiUEFUSUVOVCIsImp0aSI6IjhodWNraDNyM3FvbWM0bTUxOG0iLCJpYXQiOjE3NTA0MTIwNDksImV4cCI6MTc1MDQ5ODQ0OX0.zoTsUebrhKAMufm7ixEOKXc62Oqt__rxHds8IxdrvAs','2025-06-20 10:34:09','2025-06-21 09:34:09',1,'8huckh3r3qomc4m518m',3),(12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImp0aSI6Imh4cHBqaDhxaXZhbWM0bTdjZjEiLCJpYXQiOjE3NTA0MTIxNTcsImV4cCI6MTc1MDQxNTc1N30.vzkzHJktTsbBZJA-YTng-b6X-gIQKRboJBSNgqjvNP8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImp0aSI6Imh4cHBqaDhxaXZhbWM0bTdjZjEiLCJpYXQiOjE3NTA0MTIxNTcsImV4cCI6MTc1MDQ5ODU1N30.Of5MXu1CX_hlMebzO-E9k5_ucwJAO01RG2B_PWcm3cc','2025-06-20 10:35:57','2025-06-21 09:35:57',1,'hxppjh8qivamc4m7cf1',1),(13,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoidGVzdDRAZXhhbXBsZS5jb20iLCJyb2xlIjoiUEFUSUVOVCIsImp0aSI6Im5jdDA4Zjk3bXZtYzU0c3cweCIsImlhdCI6MTc1MDQ0MzM5NSwiZXhwIjoxNzUwNDQ2OTk1fQ.12CSZFi0tW7kereV6Z_MOk4McmnRWRGJW6K3dh4oZkc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoidGVzdDRAZXhhbXBsZS5jb20iLCJyb2xlIjoiUEFUSUVOVCIsImp0aSI6Im5jdDA4Zjk3bXZtYzU0c3cweCIsImlhdCI6MTc1MDQ0MzM5NSwiZXhwIjoxNzUwNTI5Nzk1fQ.SNgRNJ8c6cMeUWgcaUyCkUujocL_2E-X7_7-z_KYEA0','2025-06-20 19:16:35','2025-06-21 18:16:35',1,'nct08f97mvmc54sw0x',3),(14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoidGVzdDRAZXhhbXBsZS5jb20iLCJyb2xlIjoiUEFUSUVOVCIsImp0aSI6Ijh3OTkwNm8zZ2dnbWM1NHZ5MXgiLCJpYXQiOjE3NTA0NDM1MzcsImV4cCI6MTc1MDQ0NzEzN30.n72t92iFBcoGLYt_0Guw0Ep3boJgcl8vI17X-lMfU8w','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoidGVzdDRAZXhhbXBsZS5jb20iLCJyb2xlIjoiUEFUSUVOVCIsImp0aSI6Ijh3OTkwNm8zZ2dnbWM1NHZ5MXgiLCJpYXQiOjE3NTA0NDM1MzcsImV4cCI6MTc1MDUyOTkzN30.n1LpNNCumQhagKWm83Ktg_BLepVrsyKNMhh_PaDUHlc','2025-06-20 19:18:58','2025-06-21 18:18:58',0,'8w9906o3gggmc54vy1x',3),(15,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImp0aSI6ImgxNXJuZDBqbXBwbWM1NHdrZHgiLCJpYXQiOjE3NTA0NDM1NjYsImV4cCI6MTc1MDQ0NzE2Nn0.PWW1iqbtLnKXTzLt1cJCKktDz4mg792Ip3W4k4n0tMU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImp0aSI6ImgxNXJuZDBqbXBwbWM1NHdrZHgiLCJpYXQiOjE3NTA0NDM1NjYsImV4cCI6MTc1MDUyOTk2Nn0.YyiM17zKMREuVR6SVzkT7jPzdk3EFGB8fiGoFqsuHrQ','2025-06-20 19:19:27','2025-06-21 18:19:27',1,'h15rnd0jmppmc54wkdx',1),(16,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImp0aSI6InZqaGd6bW01dnltY2F6M3BuaSIsImlhdCI6MTc1MDc5NjYxOSwiZXhwIjoxNzUwODAwMjE5fQ.6dhbmMDoFJ6y_ZMmx3IcDqSm1qFb4LFF1SbBshokIRs','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImp0aSI6InZqaGd6bW01dnltY2F6M3BuaSIsImlhdCI6MTc1MDc5NjYxOSwiZXhwIjoxNzUwODgzMDE5fQ.JQcdYuBa0qbeV-ZDDInoz5iyOAtg2JT9-cVjs1-C4j4','2025-06-24 21:23:40','2025-06-25 20:23:40',0,'vjhgzmm5vymcaz3pni',1);
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
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
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'test@example.com','$2b$10$Sv5hN/aL5VrlUZbReCc75usf3LX2cneWScM0vnqYBJdNrEFH5Li.i','ADMIN',NULL,NULL,NULL,NULL,NULL,'2025-06-05 21:21:45.709375','2025-06-24 20:23:31.000000'),(2,'test3@example.com','$2b$10$QhJbTfdvBPDd8ZqnYh01yOoeKFI7rZwyst.ohPfHaySNQGCldiLYi','PATIENT',NULL,NULL,NULL,'03057808c062af5dcdca1cf31fb704320d181be14068cef4ff365ca7cae630a9','2025-06-06 00:55:24','2025-06-05 23:27:50.900210','2025-06-20 18:19:21.903971'),(3,'test4@example.com','$2b$10$QhJbTfdvBPDd8ZqnYh01yOoeKFI7rZwyst.ohPfHaySNQGCldiLYi','PATIENT',NULL,NULL,NULL,NULL,NULL,'2025-06-06 00:43:58.860106','2025-06-06 00:43:58.860106');
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

-- Dump completed on 2025-06-24 22:37:17
