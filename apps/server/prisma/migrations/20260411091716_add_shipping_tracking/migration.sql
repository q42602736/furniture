-- AlterTable
ALTER TABLE `orders` ADD COLUMN `shipping_company` VARCHAR(50) NULL,
    ADD COLUMN `tracking_no` VARCHAR(100) NULL;
