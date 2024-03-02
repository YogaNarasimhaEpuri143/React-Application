-- CreateTable
CREATE TABLE "User" (
    "sno" SERIAL NOT NULL,
    "customer" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dummy_data" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("sno")
);
