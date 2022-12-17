import { operators } from './formula-symbols.js';

let formula1 = 'A1+2-B2/C3:C6*"fuck"'
const formula1Copy = formula1;
const expr = "7.2*6+3/2-5*6+(7-2)*5";
const copy = expr;


export const getOperatorTokens = (formulaString = '') => {
  let formulaLength = formulaString.length || 0;
  let position = 0;
  let operatorTokens = [];

  while (!(position >= formulaLength)) {

    if (operators.has(formulaString[position])) {
      operatorTokens.push({ value: formulaString[position], type: 'operator', index: position });
    }

    position++;
  }

  return operatorTokens;
};

export const getValueTokens = (formulaString = '', operatorTokens = []) => {
  let position = 0;

  const result = operatorTokens.reduce((tokens, curr, i) => {
    i += i <= 1 ? i : i + 1;

    const token = { value: formulaString.slice(position, curr.index), type: '', index: i };

    if (!!(+token.value)) {
      token.type = 'number';
      token.value = +token.value;
    }

    else if (token.value.startsWith('"') && token.value.endsWith('"')) {
      token.type = 'string';
    }

    else token.type = 'reference';


    position = curr.index + 1;

    return [...tokens, token, { ...curr, index: i + 1 }];

  }, [{ value: formulaString.slice(operatorTokens[operatorTokens.length - 1].index + 1), type: '', index: -1 }]);

  return [...result, { ...result.shift(), index: result.length + 1 }].slice(1);
};


export const tokenizeFormula = (formulaString = '') => {
  const operatorTokensResult = getOperatorTokens(formulaString);

  return getValueTokens(formulaString, operatorTokensResult);
};



export const parseFormula = (formulaInput = '') => {
  if (!(!!formulaInput)) return;

  if (!formulaInput.startsWith('=')) return formulaInput;

  const formula = formulaInput.slice(1)


};
