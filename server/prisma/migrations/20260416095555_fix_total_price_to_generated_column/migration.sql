-- AlterTable: total_price를 DEFAULT 표현식에서 진정한 생성 컬럼으로 변경
ALTER TABLE `purchase_items`
  DROP COLUMN `total_price`,
  ADD COLUMN `total_price` INTEGER AS (unit_price * quantity) STORED NOT NULL;
