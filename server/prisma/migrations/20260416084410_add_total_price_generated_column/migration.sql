-- AlterTable
ALTER TABLE `purchase_items` ADD COLUMN `total_price` INTEGER NOT NULL DEFAULT (unit_price * quantity);
