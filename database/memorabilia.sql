-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Gen 20, 2026 alle 13:55
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `memorabilia`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('In elaborazione','Spedito','Consegnato') DEFAULT 'In elaborazione',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_price`, `status`, `created_at`) VALUES
(1, 1, 1250.00, 'Spedito', '2026-01-19 12:08:14'),
(2, 19, 450.00, 'In elaborazione', '2026-01-19 12:28:29'),
(3, 19, 320.00, 'In elaborazione', '2026-01-19 12:33:24'),
(4, 19, 265.00, 'In elaborazione', '2026-01-19 12:37:28'),
(5, 19, 580.00, 'In elaborazione', '2026-01-19 12:39:38'),
(6, 19, 265.00, 'In elaborazione', '2026-01-19 12:41:30'),
(7, 19, 5950.00, 'In elaborazione', '2026-01-19 13:47:13'),
(8, 20, 4500.00, 'In elaborazione', '2026-01-19 14:00:09'),
(9, 20, 275.00, 'In elaborazione', '2026-01-19 14:03:39');

-- --------------------------------------------------------

--
-- Struttura della tabella `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `price_at_purchase` decimal(10,2) NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `price_at_purchase`, `quantity`) VALUES
(1, 2, 1, 120.00, 1),
(2, 2, 2, 250.00, 1),
(3, 2, 3, 80.00, 1),
(4, 3, 3, 80.00, 1),
(5, 3, 3, 80.00, 1),
(6, 3, 3, 80.00, 1),
(7, 3, 3, 80.00, 1),
(8, 4, 1, 120.00, 2),
(9, 5, 2, 250.00, 2),
(10, 5, 3, 80.00, 1),
(11, 6, 1, 120.00, 2),
(12, 7, 2, 250.00, 1),
(13, 7, 9, 2850.00, 2),
(14, 8, 8, 4500.00, 1),
(15, 9, 2, 250.00, 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL,
  `sport` varchar(100) NOT NULL DEFAULT 'Generico',
  `rating` decimal(3,1) DEFAULT 0.0,
  `reviewCount` int(11) DEFAULT 0,
  `stock` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `image`, `sport`, `rating`, `reviewCount`, `stock`) VALUES
(1, 'Maglia Autografata', 120.00, '/maglia1.jpg', 'Basket', 4.2, 13, 0),
(2, 'Scarpe da Basket Firmate', 250.00, '/scarpe1.png\r\n', 'Basket', 4.0, 10, 2),
(3, 'Pallone da Calcio Vintage', 80.00, '/pallone1.jpg', 'Calcio', 3.5, 7, 0),
(4, 'Poster Leggendario', 40.00, '/poster1.jpg', 'Basket', 3.7, 4, 10),
(8, 'Racchetta autografata', 4500.00, '/racchetta1.jpg\r\n', 'Tennis', 4.7, 16, 1),
(9, 'Guanti Lewis Hamilton ', 2850.00, '/guanti1.jpg', 'Formula 1', 3.3, 13, 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `created_at`) VALUES
(1, 'DAnielelelele', '$2b$10$RJj8imxCZ/qvLYknRcggieadsuv9vg80cFxkItE9Ay6gRwuUDJgei', '2025-09-16 12:46:26'),
(6, 'UUU', '$2b$10$4sLWNC5WLMJZy9AHJ36w8OXrgRu8xZUYCKVAVeYN.7AHH5zgnzwQu', '2025-09-16 12:52:35'),
(7, 'lala', '$2b$10$A6ewpDbv80FLAzyLLksTaOCb/qlzp2x1kqXt.7BihV2bIMFUXc5Gm', '2025-09-16 12:53:01'),
(8, 'ulla', '$2b$10$GZw8oSSV9678pm7ZrSD3Y.aiunLYCuWfFip7de8Ph2nngE3jVZIaW', '2025-09-16 12:54:21'),
(9, 'ebbro', '$2b$10$SgQXrBxXxBZjbqDFPCDe6eBWnfMkuPAezKZOXssWgy76v8L9uhkta', '2025-09-16 12:55:57'),
(11, 'donno', '$2b$10$F5DzcRVu/SeHI/ymOPnG.OL6/HKqJqgD18M8DSlSYSpzs87jOHIB6', '2025-09-16 12:57:45'),
(13, 'dani', '$2b$10$zbZlXoClyjdPZ9lfQ6OYaO0vJTK5J4jGth4pzxHXLU6qYPxQcvOVW', '2025-09-16 13:16:44'),
(15, 'aaa', '$2b$10$Uhk3h4QM1QKR0vW8PCF93eAID9b.l9szofKpGTVp.ggpj.mUjvUYm', '2025-09-16 13:16:57'),
(16, 'bambaa', '$2b$10$bH0FWXJ3oDBqgavNeM90RO9tfDJ6AiWO0ivrjKpcZtBxdjBCVfs9q', '2025-09-16 13:21:00'),
(18, 'qqqq', '$2b$10$ySdAwk/UO3ft4c1XxWaqr.byLowCEtv/V7JHFzRzUT24R0fug1j9m', '2025-09-16 13:21:16'),
(19, 'daniele', '$2b$10$B8dgaXQ4PdHOs6DyAlp2fuzE8i/Nhc9qQ79BZyHpb2S2dNqK1gLEK', '2026-01-18 10:49:37'),
(20, 'Bruno', '$2b$10$ClsIsQrtxlXHJm7JV1op4.L3IDYYtv1S/fei288R.jMzVBha9MfIu', '2026-01-19 13:54:15'),
(21, '2000', '$2b$10$9/sxVDPu8y7Oou1c6Pt48.f9enWr4DJeWtFjZBM97aQN3T.0FAtrS', '2026-01-20 11:11:42');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indici per le tabelle `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT per la tabella `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT per la tabella `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
