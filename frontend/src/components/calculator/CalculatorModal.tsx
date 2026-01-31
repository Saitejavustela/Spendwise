import { useCalculatorStore } from "../../store/calculatorStore";
import { useAddExpenseAmount } from "../../store/addExpenseAmountStore";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { useState } from "react";

const CalculatorModal = () => {
  const { isOpen, close, setResult } = useCalculatorStore();
  const setAmount = useAddExpenseAmount((s) => s.setAmount);
  const [display, setDisplay] = useState("0");
  const [currentNumber, setCurrentNumber] = useState("0");
  const [previousNumber, setPreviousNumber] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewNumber, setWaitingForNewNumber] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForNewNumber) {
      setCurrentNumber(num);
      setDisplay(num);
      setWaitingForNewNumber(false);
    } else {
      const newNumber = currentNumber === "0" ? num : currentNumber + num;
      setCurrentNumber(newNumber);
      setDisplay(newNumber);
    }
  };

  const handleDecimal = () => {
    if (waitingForNewNumber) {
      setCurrentNumber("0.");
      setDisplay("0.");
      setWaitingForNewNumber(false);
    } else if (!currentNumber.includes(".")) {
      const newNumber = currentNumber + ".";
      setCurrentNumber(newNumber);
      setDisplay(newNumber);
    }
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case "+": return prev + current;
      case "-": return prev - current;
      case "*": return prev * current;
      case "/": return current !== 0 ? prev / current : 0;
      default: return current;
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(currentNumber);
    
    if (previousNumber !== null && operator && !waitingForNewNumber) {
      const result = calculate(previousNumber, current, operator);
      const rounded = Math.round(result * 100) / 100;
      setPreviousNumber(rounded);
      setDisplay(String(rounded));
    } else {
      setPreviousNumber(current);
    }
    
    setOperator(op);
    setWaitingForNewNumber(true);
  };

  const handleClear = () => {
    setDisplay("0");
    setCurrentNumber("0");
    setPreviousNumber(null);
    setOperator(null);
    setWaitingForNewNumber(false);
  };

  const handleEquals = () => {
    if (previousNumber === null || operator === null) {
      const value = parseFloat(currentNumber);
      if (!isNaN(value) && value > 0 && setAmount) {
        setResult(value);
        setAmount(value);
        handleClear();
        close();
      }
      return;
    }

    const current = parseFloat(currentNumber);
    const result = calculate(previousNumber, current, operator);
    const rounded = Math.round(result * 100) / 100;
    
    setDisplay(String(rounded));
    setCurrentNumber(String(rounded));
    setResult(rounded);
    setPreviousNumber(null);
    setOperator(null);
    setWaitingForNewNumber(true);

    if (rounded > 0 && setAmount) {
      setAmount(rounded);
      handleClear();
      close();
    }
  };

  const getOperatorDisplay = (op: string) => {
    switch (op) {
      case "*": return "×";
      case "/": return "÷";
      default: return op;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { handleClear(); close(); }}>
      <DialogContent className="p-0 overflow-hidden max-w-xs bg-gray-200 dark:bg-gray-800 rounded-3xl border-0 shadow-2xl">
        {/* Display */}
        <div className="bg-gray-900 px-6 py-8 text-right">
          <div className="text-gray-500 text-sm h-5 mb-1">
            {previousNumber !== null && operator && (
              <span>{previousNumber} {getOperatorDisplay(operator)}</span>
            )}
          </div>
          <div className="text-white text-4xl font-light tracking-wide truncate">
            {display}
          </div>
        </div>

        {/* Button Grid */}
        <div className="p-4 grid grid-cols-4 gap-3">
          {/* Row 1: Operators */}
          <button onClick={() => handleOperator("+")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-xl font-medium text-gray-800 dark:text-white transition-all active:scale-95">+</button>
          <button onClick={() => handleOperator("-")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-xl font-medium text-gray-800 dark:text-white transition-all active:scale-95">-</button>
          <button onClick={() => handleOperator("*")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-xl font-medium text-gray-800 dark:text-white transition-all active:scale-95">×</button>
          <button onClick={() => handleOperator("/")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-xl font-medium text-gray-800 dark:text-white transition-all active:scale-95">÷</button>

          {/* Row 2: 7, 8, 9, = */}
          <button onClick={() => handleNumber("7")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-2xl font-medium text-gray-900 dark:text-white transition-all active:scale-95">7</button>
          <button onClick={() => handleNumber("8")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-2xl font-medium text-gray-900 dark:text-white transition-all active:scale-95">8</button>
          <button onClick={() => handleNumber("9")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-2xl font-medium text-gray-900 dark:text-white transition-all active:scale-95">9</button>
          <button onClick={handleEquals} className="row-span-4 w-14 rounded-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 shadow-lg text-2xl font-bold text-white dark:text-gray-900 transition-all active:scale-95 flex items-center justify-center">=</button>

          {/* Row 3: 4, 5, 6 */}
          <button onClick={() => handleNumber("4")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-2xl font-medium text-gray-900 dark:text-white transition-all active:scale-95">4</button>
          <button onClick={() => handleNumber("5")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-2xl font-medium text-gray-900 dark:text-white transition-all active:scale-95">5</button>
          <button onClick={() => handleNumber("6")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-2xl font-medium text-gray-900 dark:text-white transition-all active:scale-95">6</button>

          {/* Row 4: 1, 2, 3 */}
          <button onClick={() => handleNumber("1")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-2xl font-medium text-gray-900 dark:text-white transition-all active:scale-95">1</button>
          <button onClick={() => handleNumber("2")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-2xl font-medium text-gray-900 dark:text-white transition-all active:scale-95">2</button>
          <button onClick={() => handleNumber("3")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-2xl font-medium text-gray-900 dark:text-white transition-all active:scale-95">3</button>

          {/* Row 5: 0, ., AC */}
          <button onClick={() => handleNumber("0")} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-2xl font-medium text-gray-900 dark:text-white transition-all active:scale-95">0</button>
          <button onClick={handleDecimal} className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-2xl font-medium text-gray-900 dark:text-white transition-all active:scale-95">.</button>
          <button onClick={handleClear} className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 shadow-md text-xl font-medium text-gray-700 dark:text-gray-200 transition-all active:scale-95">AC</button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalculatorModal;
