/*
  Warnings:

  - You are about to drop the column `ocr_status` on the `receipts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[purchase_item_no]` on the table `purchase_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[purchase_no]` on the table `purchases` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[purchase_id]` on the table `receipts` will be added. If there are existing duplicate values, this will fail.
  - Made the column `purchase_item_no` on table `purchase_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `purchase_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `backorder_quantity` on table `purchase_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `purchase_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `purchases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `receipts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `vendors` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `purchase_items` MODIFY `purchase_item_no` VARCHAR(50) NOT NULL,
    MODIFY `category` ENUM('TOP', 'OUTER', 'BOTTOM', 'SET', 'BAG', 'SHOES', 'JEWELRY', 'ACCESSORY', 'ETC') NOT NULL,
    MODIFY `backorder_quantity` INTEGER NOT NULL DEFAULT 0,
    MODIFY `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `purchases` MODIFY `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `receipts` DROP COLUMN `ocr_status`,
    MODIFY `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `users` ADD COLUMN `refresh_token` VARCHAR(1000) NULL,
    MODIFY `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `vendors` MODIFY `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- CreateIndex
CREATE UNIQUE INDEX `purchase_items_purchase_item_no_key` ON `purchase_items`(`purchase_item_no`);

-- CreateIndex
CREATE UNIQUE INDEX `purchases_purchase_no_key` ON `purchases`(`purchase_no`);

-- CreateIndex
CREATE UNIQUE INDEX `receipts_purchase_id_key` ON `receipts`(`purchase_id`);
