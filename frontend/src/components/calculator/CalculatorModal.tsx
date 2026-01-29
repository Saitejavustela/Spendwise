import { useCalculatorStore } from "../../store/calculatorStore";
import { useAddExpenseAmount } from "../../store/addExpenseAmountStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const CalculatorModal = () => {
  const { isOpen, close, expression, setExpression, setResult } = useCalculatorStore();
  const setAmount = useAddExpenseAmount((s) => s.setAmount);

  const [error, setError] = useState("");

  const evaluate = () => {
    try {
      // Evaluate expression safely
      const r = eval(expression);
      if (isNaN(r)) throw new Error("Invalid expression");
      setResult(r);
      setError("");
      return r;
    } catch {
      setError("Invalid expression");
      setResult(null);
      return null;
    }
  };

  const sendToExpense = () => {
    const r = evaluate();
    if (r === null) return;

    if (setAmount) {
      setAmount(r); // <- Send value to Add Expense form
    }

    close(); // auto close
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      evaluate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md space-y-4">

        <h2 className="text-xl font-semibold">Calculator</h2>

        <Input
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type expression e.g. 120 + 45 - 5"
          className="text-lg"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-blue-600 text-white"
            onClick={evaluate}
          >
            Calculate
          </Button>

          <Button
            className="flex-1 bg-green-600 text-white"
            onClick={sendToExpense}
          >
            Use Result
          </Button>
        </div>

        <Button variant="outline" onClick={close} className="w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CalculatorModal;
