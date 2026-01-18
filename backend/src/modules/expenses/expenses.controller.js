import * as service from "./expenses.service.js";
import { createExpenseSchema, decisionSchema } from "./expenses.schema.js";

export const createExpense = async (req, res) => {
  try {
    const data = createExpenseSchema.parse(req.body);
    const expense = await service.createExpense(data, req.user);

    await req.audit("EXPENSE_CREATED", {
      expenseId: expense.id,
      amount: expense.amount,
      category: expense.category,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// export const listExpenses = async (req, res) => {
//   const expenses = await service.getExpenses(req.user);
//   res.json(expenses);
// };

export const listExpenses = async (req, res) => {
  try {
    const result = await service.getExpenses(req.query, req.user);
    // console.log(" ALL QUERY ",req.query)

    // await req.audit("EXPENSE_LIST_VIEWED", {
    //   filters: req.query,
    // });

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// export const analytics = async (req, res) => {
//   console.log("ALLuser : ",req.user)
//   try{
//     const result = await service.analytics(req.query, req.user);
//   } catch (err){
//     res.status(400).json({ message: err.message })
//   }
// }

export const getExpense = async (req, res) => {
  try {
    const expense = await service.getExpenseById(req.params.id, req.user);
    res.json(expense);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await service.updateExpense(
      req.params.id,
      req.body,
      req.user
    );
    res.json(expense);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

// export const deleteExpense = async (req, res) => {
//   try {
//     await service.deleteExpense(req.params.id, req.user);
//     res.json({ message: "Expense deleted" });
//   } catch (err) {
//     res.status(403).json({ message: err.message });
//   }
// };

export const deleteExpense = async (req, res) => {
  try {
    const expense = await service.getExpenseById(req.params.id, req.user);

    await service.deleteExpense(req.params.id, req.user);

    await req.audit("EXPENSE_DELETED", {
      expenseId: expense.id,
      amount: expense.amount,
      category: expense.category,
      deletedByRole: req.user.role,
    });

    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};


export const decideExpense = async (req, res) => {
  try {
    const data = decisionSchema.parse(req.body );
    console.log("data", data);
    const result = await service.decideExpense(req.params.id, data, req.user);
    await req.audit(
      data.decision === "APPROVED"
        ? "EXPENSE_APPROVED"
        : "EXPENSE_REJECTED",
      {
        expenseId: req.params.id,
        decision: data.decision,
        comment: data.comment,
      }
    );
    console.log("result", result)
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
