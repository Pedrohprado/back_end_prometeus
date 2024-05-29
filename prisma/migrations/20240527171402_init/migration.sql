-- CreateTable
CREATE TABLE "Prometeus" (
    "id" TEXT NOT NULL,
    "prometeusCode" TEXT NOT NULL,
    "soldador" TEXT NOT NULL,
    "cartao" INTEGER NOT NULL,
    "setor" INTEGER NOT NULL,
    "gas" TEXT NOT NULL,
    "vazaoDoGas" TEXT NOT NULL,
    "diametroArame" TEXT NOT NULL,
    "velocidadeArame" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prometeus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Welding" (
    "id" TEXT NOT NULL,
    "capture" TEXT NOT NULL,
    "amperagem" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weldingId" TEXT NOT NULL,

    CONSTRAINT "Welding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Welding" ADD CONSTRAINT "Welding_weldingId_fkey" FOREIGN KEY ("weldingId") REFERENCES "Prometeus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
