const vscode = require("vscode");
const _string = require("underscore.string");
const apStyleTitleCase = require("ap-style-title-case");
const chicagoStyleTitleCase = require("chicago-capitalize");
const slugify = require("@sindresorhus/slugify");
const defaultFunction = (commandName, option) => (str) =>
  _string[commandName](str, option);
const leftPadZero = (num, digits, trim) => {
  let text = (((num === null) || (num === undefined)) || isNaN(num)) ? "" : (num + "");
  let paddingLength = (digits - text.length);
  return (paddingLength > 0) 
    ? ("0".repeat(paddingLength) + text)
    : (trim ? text.substr(paddingLength, digits) : text)
  ;
};
/* 
const sequence = (str, multiselectData = {}) => {
  return str.replace(/-?\d+/g, (n) => {
    const isFirst = typeof multiselectData.offset !== "number";
    multiselectData.offset = isFirst ? Number(n) : multiselectData.offset + 1;
    return multiselectData.offset;
  });
};
*/
const sequenceProcessing = (str, multiselectData = {}, withZero) => {
  str = str.replace(/-?\d+/g, (n) => {
    if (isNaN(multiselectData.offset)) {
      multiselectData.offset = isNaN(Number(n)) ? 1 : Number(n);
    } else {
      multiselectData.offset = multiselectData.offset + 1;
    }
    if ((multiselectData.textLength === null) || (multiselectData.textLength === undefined)) {
      multiselectData.textLength = n.length;
    }
    if (isNaN(multiselectData.textLength) || (multiselectData.textLength <= 0)) {
      multiselectData.textLength = 1;
    }
    return withZero ? leftPadZero(multiselectData.offset, multiselectData.textLength) : multiselectData.offset;
  });
  return { str, multiselectData, withZero };
};
const sequence = (str, multiselectData) => sequenceProcessing(str, multiselectData, false).str;
const sequenceWithZero = (str, multiselectData) => sequenceProcessing(str, multiselectData, true).str;
const increment = (str, duplicate) => str.replace(/-?\d+/g, (n) => {
  let result = Number(n) + 1;
  return duplicate ? (n + result) : result;
});
const decrement = (str, duplicate) => str.replace(/-?\d+/g, (n) => {
  let result = Number(n) - 1;
  return duplicate ? (n + result) : result;
});
const incrementWithZero = (str, duplicate) => str.replace(/-?\d+/g, (n) => {
  let result = leftPadZero(Number(n) + 1, n.length);
  return duplicate ? (n + result) : result;
});
const decrementWithZero = (str, duplicate) => str.replace(/-?\d+/g, (n) => {
  let result = leftPadZero(Number(n) - 1, n.length);
  return duplicate ? (n + result) : result;
});

const commandNameFunctionMap = {
  showAllFunctionTypes: null,
  showAllFunctions: null,
  showAllStringFunctions: null,
  showAllNumberFunctions: null,
  showAllNumberIncrementFunctions: null,
  showAllNumberDecrementFunctions: null,
  showAllNumberSequenceFunctions: null,
  titleize: defaultFunction("titleize"),
  chop: (n) => defaultFunction("chop", n),
  classify: defaultFunction("classify"),
  clean: defaultFunction("clean"),
  cleanDiacritics: defaultFunction("cleanDiacritics"),
  underscored: defaultFunction("underscored"),
  dasherize: defaultFunction("dasherize"),
  humanize: defaultFunction("humanize"),
  reverse: defaultFunction("reverse"),
  decapitalize: defaultFunction("decapitalize"),
  capitalize: defaultFunction("capitalize"),
  sentence: defaultFunction("capitalize", true),
  camelize: (str) =>
    _string.camelize(str.match(/[a-z]/) ? str : str.toLowerCase()),
  slugify: slugify,
  swapCase: defaultFunction("swapCase"),
  snake: (str) =>
    _string
      .underscored(str)
      .replace(/([A-Z])[^A-Z]/g, " $1")
      .replace(/[^a-z]+/gi, " ")
      .trim()
      .replace(/\s/gi, "_"),
  screamingSnake: (str) =>
    _string
      .underscored(str)
      .replace(/([A-Z])[^A-Z]/g, " $1")
      .replace(/[^a-z]+/gi, " ")
      .trim()
      .replace(/\s/gi, "_")
      .toUpperCase(),
  titleizeApStyle: apStyleTitleCase,
  titleizeChicagoStyle: chicagoStyleTitleCase,
  truncate: (n) => defaultFunction("truncate", n),
  prune: (n) => (str) => str.slice(0, n - 3).trim() + "...",
  repeat: (n) => defaultFunction("repeat", n),
  // FIXED 2025-07-06 Fix the conflict between param [duplicate] and param [multiselectData], this two param are both at the second position
  // increment,
  // decrement,
  increment: (str) => increment(str, false),
  decrement: (str) => decrement(str, false),
  duplicateAndIncrement: (str) => str + increment(str),
  duplicateAndDecrement: (str) => str + decrement(str),
  duplicateNumAndIncrement: (str) => increment(str, true),
  duplicateNumAndDecrement: (str) => decrement(str, true),
  // FIXED 2025-07-06 Fix the conflict between param [duplicate] and param [multiselectData], this two param are both at the second position
  // incrementWithZero,
  // decrementWithZero,
  incrementWithZero: (str) => incrementWithZero(str, false),
  decrementWithZero: (str) => decrementWithZero(str, false),
  duplicateAndIncrementWithZero: (str) => str + incrementWithZero(str),
  duplicateAndDecrementWithZero: (str) => str + decrementWithZero(str),
  duplicateNumAndIncrementWithZero: (str) => incrementWithZero(str, true),
  duplicateNumAndDecrementWithZero: (str) => decrementWithZero(str, true),
  sequence,
  sequenceWithZero,
  utf8ToChar: (str) => str.match(/\\u[\dA-Fa-f]{4}/g).map((x) => x.slice(2)).map((x) => String.fromCharCode(parseInt(x, 16))).join(""),
  charToUtf8: (str) => str.split("").map((x) => `\\u${x.charCodeAt(0).toString(16).padStart(4, '0')}`).join(""),
};
const numberFunctionNames = [
  "increment",
  "decrement",
  "sequence",
  "duplicateAndIncrement",
  "duplicateAndDecrement",
  "duplicateNumAndIncrement",
  "duplicateNumAndDecrement",
  "incrementWithZero",
  "decrementWithZero",
  "sequenceWithZero",
  "duplicateAndIncrementWithZero",
  "duplicateAndDecrementWithZero",
  "duplicateNumAndIncrementWithZero",
  "duplicateNumAndDecrementWithZero",
];
const functionNamesWithArgument = ["chop", "truncate", "prune", "repeat"];
const functionQuickPickItemMap = {
  // FUNCTION ITEMS
  "titleize": { label: "Titleize", description: "", detail: null },
  "titleizeApStyle": { label: "Titleize (AP Style)", description: "", detail: null },
  "titleizeChicagoStyle": { label: "Titleize (Chicago Style)", description: "", detail: null },
  "camelize": { label: "Camelize", description: "", detail: null },
  "chop": { label: "Chop", description: "", detail: null },
  "clean": { label: "Clean", description: "", detail: null },
  "cleanDiacritics": { label: "Clean diacritics", description: "", detail: null },
  "classify": { label: "Classify", description: "", detail: null },
  "underscored": { label: "Underscored", description: "", detail: null },
  "dasherize": { label: "Dasherize", description: "", detail: null },
  "humanize": { label: "Humanize", description: "", detail: null },
  "slugify": { label: "Slugify", description: "", detail: null },
  "snake": { label: "Snake", description: "", detail: null },
  "screamingSnake": { label: "Screaming Snake", description: "", detail: null },
  "reverse": { label: "Reverse", description: "", detail: null },
  "swapCase": { label: "Swap Case", description: "", detail: null },
  "decapitalize": { label: "Decapitalize", description: "", detail: null },
  "capitalize": { label: "Capitalize", description: "", detail: null },
  "sentence": { label: "Sentence", description: "", detail: null },
  "truncate": { label: "Truncate", description: "", detail: null },
  "prune": { label: "Prune", description: "", detail: null },
  "repeat": { label: "Repeat", description: "", detail: null },
  "increment": { label: "Increment all numbers", description: "", detail: null },
  "decrement": { label: "Decrement all numbers", description: "", detail: null },
  "duplicateAndIncrement": { label: "Duplicate and increment all numbers", description: "", detail: null },
  "duplicateAndDecrement": { label: "Duplicate and decrement all numbers", description: "", detail: null },
  "duplicateNumAndIncrement": { label: "Duplicate the number part and increment new number copies", description: "", detail: null },
  "duplicateNumAndDecrement": { label: "Duplicate the number part and decrement new number copies", description: "", detail: null },
  "incrementWithZero": { label: "Increment all numbers with 0 paddings at left", description: "", detail: null },
  "decrementWithZero": { label: "Decrement all numbers with 0 paddings at left", description: "", detail: null },
  "duplicateAndIncrementWithZero": { label: "Duplicate and increment all numbers with 0 paddings at left", description: "", detail: null },
  "duplicateAndDecrementWithZero": { label: "Duplicate and decrement all numbers with 0 paddings at left", description: "", detail: null },
  "duplicateNumAndIncrementWithZero": { label: "Duplicate the number part and increment new number copies with 0 paddings at left", description: "", detail: null },
  "duplicateNumAndDecrementWithZero": { label: "Duplicate the number part and decrement new number copies with 0 paddings at left", description: "", detail: null },
  "sequence": { label: "Sequence all numbers (starting with first number)", description: "", detail: null },
  "sequenceWithZero": { label: "Sequence all numbers with 0 paddings at left (starting with first number)", description: "", detail: null },
  // TYPE ITEMS
  "showAllFunctions": { label: "Show all functions", description: "", detail: null },
  "showAllStringFunctions": { label: "Show string functions", description: "", detail: null },
  "showAllNumberFunctions": { label: "Show number functions", description: "", detail: null },
  "showAllNumberIncrementFunctions": { label: "Show number increment functions", description: "", detail: null },
  "showAllNumberDecrementFunctions": { label: "Show number decrement functions", description: "", detail: null },
  "showAllNumberSequenceFunctions": { label: "Show number sequence functions", description: "", detail: null },
};
const functionListMap = {
  "showAllFunctions": [],
  "showAllStringFunctions": [
    "titleize",
    "titleizeApStyle",
    "titleizeChicagoStyle",
    "camelize",
    "chop",
    "clean",
    "cleanDiacritics",
    "classify",
    "underscored",
    "dasherize",
    "humanize",
    "slugify",
    "snake",
    "screamingSnake",
    "reverse",
    "swapCase",
    "decapitalize",
    "capitalize",
    "sentence",
    "truncate",
    "prune",
    "repeat",
  ],
  "showAllNumberFunctions": [
    "increment",
    "decrement",
    "duplicateAndIncrement",
    "duplicateAndDecrement",
    "duplicateNumAndIncrement",
    "duplicateNumAndDecrement",
    "incrementWithZero",
    "decrementWithZero",
    "duplicateAndIncrementWithZero",
    "duplicateAndDecrementWithZero",
    "duplicateNumAndIncrementWithZero",
    "duplicateNumAndDecrementWithZero",
    "sequence",
    "sequenceWithZero",
  ],
  "showAllNumberIncrementFunctions": [
    "increment",
    "duplicateAndIncrement",
    "duplicateNumAndIncrement",
    "incrementWithZero",
    "duplicateAndIncrementWithZero",
    "duplicateNumAndIncrementWithZero",
  ],
  "showAllNumberDecrementFunctions": [
    "decrement",
    "duplicateAndDecrement",
    "duplicateNumAndDecrement",
    "decrementWithZero",
    "duplicateAndDecrementWithZero",
    "duplicateNumAndDecrementWithZero",
  ],
  "showAllNumberSequenceFunctions": [
    "sequence",
    "sequenceWithZero",
  ],
};
functionListMap.showAllFunctions = functionListMap.showAllFunctions.concat(functionListMap.showAllStringFunctions, functionListMap.showAllNumberFunctions);
 // Create this map to distinguish from "functionListMap", and collect all the keys of "functionListMap"
const functionTypeListMap = {
  "showAllFunctionTypes": Object.keys(functionListMap),
};

const stringFunction = async (commandName, context) => {
  const editor = vscode.window.activeTextEditor;
  const selectionInfos =[];
  if (!editor) {
    return;
  }
  
  // Show function type list menu/function list menu (Support multi-level menu, mixed tree menu)
  let typeList = functionTypeListMap[commandName];
  let list = functionListMap[commandName];
  if (typeList || list) {
    const nameList = typeList || list;
    const optionList = nameList.map((name, index) => {
      let item = Object.assign({}, functionQuickPickItemMap[name]);
      item.label = leftPadZero((index + 1), 2) + "-" + item.label;
      item.commandName = name;
      return item;
    });
    const choice = await vscode.window.showQuickPick(optionList);
    if (!choice || !choice.commandName) {
      return;
    }
    await stringFunction(choice.commandName, context);
    return;
    
  // Other function commands
  } else {
    let multiselectData = {};
    editor.selections.forEach(async (selection, index) => {
      const text = editor.document.getText(selection);
      const textParts = text.split("\n");
      let stringFunc, replaced;
  
      if (functionNamesWithArgument.includes(commandName)) {
        const value = await vscode.window.showInputBox();
        stringFunc = commandNameFunctionMap[commandName](value);
        replaced = textParts
          .reduce((prev, curr) => prev.push(stringFunc(curr)) && prev, [])
          .join("\n");
      } else if (numberFunctionNames.includes(commandName)) {
        replaced = commandNameFunctionMap[commandName](text, multiselectData);
      } else {
        stringFunc = commandNameFunctionMap[commandName];
        replaced = textParts
          .reduce((prev, curr) => prev.push(stringFunc(curr)) && prev, [])
          .join("\n");
      }
      selectionInfos.push({ selection, replaced });
    });
    
  }
  
  editor.edit((builder) => {
    selectionInfos.forEach(info => {
      builder.replace(info.selection, info.replaced);
    });
  });
  
  context.globalState.update('lastAction', commandName);
};

const activate = (context) => {
  context.globalState.setKeysForSync(['lastAction']);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `string-manipulation.repeatLastAction`,
      () => {
        const lastAction = context.globalState.get('lastAction');
        if (lastAction) {
          return stringFunction(lastAction, context)
        }
      }
    )
  );
  
  Object.keys(commandNameFunctionMap).forEach((commandName) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        `string-manipulation.${commandName}`,
        () => stringFunction(commandName, context)
      )
    );
  });
};

exports.activate = activate;

module.exports = {
  activate,
  commandNameFunctionMap,
};
