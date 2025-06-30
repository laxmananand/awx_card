let namePattern = /^[A-Za-z0-9 \-\'&.]+$/;
let nameMaxLength = 60;

let addressPattern = /^[A-Za-z0-9 ,.\-\/'&#@]*$/;
let addressMaxLength = 100;

let cityPattern = /^[A-Za-z \-']*$/;
let cityMaxLength = 50;

let postalCodePattern = /^[A-Za-z0-9 \-]*$/;
let postalCodeMaxLength = 10;

let websitePattern =
  /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9#-._~:\/?[\]@!$&'()*+,;=]*)?$/;
let websiteMaxLength = 100;

let personNamePattern = /^[A-Za-z \-']+$/;
let personNameMaxLength = 50;

let brnPattern = /^[A-Za-z0-9\-]+$/;
let brnMaxLength = 30;

let documentNoPattern = /^[A-Za-z0-9._-]+$/;
let documentNoMaxLength = 50;

export const restrictInputName = (e) => {
  const value = e.target.value;
  const validCharacters = value
    .split("")
    .filter((char) => namePattern.test(char))
    .join("");
  if (nameMaxLength !== undefined) {
    if (validCharacters.length <= nameMaxLength) {
      e.target.value = validCharacters;
    } else {
      e.target.value = validCharacters.slice(0, nameMaxLength);
    }
  } else {
    e.target.value = validCharacters;
  }
};

export const restrictInputAddress = (e) => {
  const value = e.target.value;
  const validCharacters = value
    .split("")
    .filter((char) => addressPattern.test(char))
    .join("");
  if (addressMaxLength !== undefined) {
    if (validCharacters.length <= addressMaxLength) {
      e.target.value = validCharacters;
    } else {
      e.target.value = validCharacters.slice(0, addressMaxLength);
    }
  } else {
    e.target.value = validCharacters;
  }
};

export const restrictInputCity = (e) => {
  const value = e.target.value;
  const validCharacters = value
    .split("")
    .filter((char) => cityPattern.test(char))
    .join("");
  if (cityMaxLength !== undefined) {
    if (validCharacters.length <= cityMaxLength) {
      e.target.value = validCharacters;
    } else {
      e.target.value = validCharacters.slice(0, cityMaxLength);
    }
  } else {
    e.target.value = validCharacters;
  }
};

export const restrictInputPostcode = (e) => {
  const value = e.target.value;
  const validCharacters = value
    .split("")
    .filter((char) => postalCodePattern.test(char))
    .join("");
  if (postalCodeMaxLength !== undefined) {
    if (validCharacters.length <= postalCodeMaxLength) {
      e.target.value = validCharacters;
    } else {
      e.target.value = validCharacters.slice(0, postalCodeMaxLength);
    }
  } else {
    e.target.value = validCharacters;
  }
};

export const restrictInputWebsite = (e) => {
  const value = e.target.value;
  const validCharacters = value
    .split("")
    .filter((char) => websitePattern.test(char))
    .join("");
  if (websiteMaxLength !== undefined) {
    if (validCharacters.length <= websiteMaxLength) {
      e.target.value = validCharacters;
    } else {
      e.target.value = validCharacters.slice(0, websiteMaxLength);
    }
  } else {
    e.target.value = validCharacters;
  }
};

export const restrictInputPersonName = (e) => {
  const value = e.target.value;
  const validCharacters = value
    .split("")
    .filter((char) => personNamePattern.test(char))
    .join("");
  if (personNameMaxLength !== undefined) {
    if (validCharacters.length <= personNameMaxLength) {
      e.target.value = validCharacters;
    } else {
      e.target.value = validCharacters.slice(0, personNameMaxLength);
    }
  } else {
    e.target.value = validCharacters;
  }
};

export const restrictInputBRN = (e) => {
  const value = e.target.value;
  const validCharacters = value
    .split("")
    .filter((char) => brnPattern.test(char))
    .join("");
  if (brnMaxLength !== undefined) {
    if (validCharacters.length <= brnMaxLength) {
      e.target.value = validCharacters;
    } else {
      e.target.value = validCharacters.slice(0, brnMaxLength);
    }
  } else {
    e.target.value = validCharacters;
  }
};

export const restrictInputDocumentNo = (e) => {
  const value = e.target.value;
  const validCharacters = value
    .split("")
    .filter((char) => documentNoPattern.test(char))
    .join("");
  if (documentNoMaxLength !== undefined) {
    if (validCharacters.length <= documentNoMaxLength) {
      e.target.value = validCharacters;
    } else {
      e.target.value = validCharacters.slice(0, documentNoMaxLength);
    }
  } else {
    e.target.value = validCharacters;
  }
};

let numberPattern = /^[0-9]+$/; // Allow only digits 0-9
let numberMaxLength = 10; // Set your desired max length

export const restrictInputNumber = (e) => {
  let value = e.target.value;

  // Allow only numeric digits
  let validCharacters = value
    .split("")
    .filter((char) => numberPattern.test(char))
    .join("");

  // Enforce max length
  if (validCharacters.length > numberMaxLength) {
    validCharacters = validCharacters.slice(0, numberMaxLength);
  }

  e.target.value = validCharacters;
};

let amountPattern = /^[0-9.]+$/; // Allow digits and decimal points
let amountMaxLength = 10; // Set your desired max length

export const restrictInputAmount = (e) => {
  let value = e.target.value;

  // Allow only valid numbers (digits and at most one decimal point)
  let validCharacters = value
    .split("")
    .filter(
      (char, index, arr) =>
        amountPattern.test(char) && (char !== "." || arr.indexOf(".") === index)
    ) // Ensure only one decimal point
    .join("");

  // Enforce max length
  if (validCharacters.length > amountMaxLength) {
    validCharacters = validCharacters.slice(0, amountMaxLength);
  }

  e.target.value = validCharacters;
};
