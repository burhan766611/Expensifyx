-- DropForeignKey
ALTER TABLE "ExpenseApproval" DROP CONSTRAINT "ExpenseApproval_approvedById_fkey";

-- AddForeignKey
ALTER TABLE "ExpenseApproval" ADD CONSTRAINT "ExpenseApproval_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
