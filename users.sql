-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 09, 2021 at 06:50 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `social`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `firstname` char(20) COLLATE utf8_swedish_ci NOT NULL,
  `lastname` char(20) COLLATE utf8_swedish_ci NOT NULL,
  `email` char(60) COLLATE utf8_swedish_ci NOT NULL,
  `password_hash` varchar(512) COLLATE utf8_swedish_ci NOT NULL,
  `register_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password_hash`, `register_date`) VALUES
(1, 'Jonas', 'Jonaitis', 'jonas@jonaitis.lt', 'jonas@jonaitis.lt', '2021-09-09 18:42:22'),
(2, 'Ona', 'Onaite', 'ona@onaite.lt', 'ona@onaite.lt', '2021-09-09 18:42:45'),
(3, 'juozas', 'juozaitis', 'juozas@juozaitis.lt', 'juozas@juozaitis.lt', '2021-09-09 18:43:04'),
(4, 'paula', 'paulaviciute', 'paula@paulaviciute.lt', 'paula@paulaviciute.lt', '2021-09-09 18:43:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
