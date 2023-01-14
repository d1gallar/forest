export const stringValidator = (value: any) => {
  if (!(typeof value === "string")) return false;
  return true;
};

export const isEmptyObj = (obj: Object) => {
  return Object.keys(obj).length === 0;
};

export const numberValidator = (value: any) => {
  if (!(typeof value === "number")) return false;
  return true;
};

export const wholeNumberValidator = (num: number) => {
  if (num % 1 !== 0) return false;
  return true;
};

export const displayPassword = (password: string) => {
  const bullet = "•";
  return bullet.repeat(password.length);
};

export const formatPhoneNumber = (phone: string) => {
  if (phone === "") return "";
  const phoneNum = phone.replace(/\D/g, "");
  let format = phoneNum.match(/(\d{3})(\d{3})(\d{4})/);
  if (format) return "(" + format[1] + ") " + format[2] + "-" + format[3];
  return phone;
};

export const digitsOnly = (str: string) => {
  return str.replace(/\D+/g, "");
};

export const isValidPhone = (phone: string) => {
  const validPhoneNum =
    /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return phone.match(validPhoneNum);
};

export const hasEightChars = (password: string) => {
  const minLen = /[a-zA-Z0-9]{8,}/;
  return minLen.test(password);
};

export const hasOneUpperCase = (str: string) => {
  const hasUppercase = /([A-Z])/;
  return hasUppercase.test(str);
};

export const hasLowercase = (str: string) => {
  const hasLowercase = /([a-z])/;
  return hasLowercase.test(str);
};

export const hasDigit = (str: string) => {
  const hasDigit = /(?=.*\d)/;
  return hasDigit.test(str);
};

export const isEmptyString = (str: string) => str === "";

export const roundToTwoDecimals = (num: number) => +num.toFixed(2);

export const calculateTax = (subtotal: number, taxRate: number) =>
  roundToTwoDecimals(subtotal * taxRate);

export const calculateItemSubTotal = (quantity: number, price: number) =>
  roundToTwoDecimals(quantity * price);

export const calculateTotal = (
  subtotal: number,
  shippingCost: number,
  tax: number
) => roundToTwoDecimals(subtotal + shippingCost + tax);

export const formatDate = (date: Date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export const calculateAmount = (amount: number) => {
  return Math.round(amount * 100);
};

export const formatDateToWMDY = (date: Date) => {
  const dateStr = date.toDateString();
  const splitDate = dateStr.split(" ");
  const result = splitDate[1] + " " + splitDate[2] + ", " + splitDate[3];
  return result;
};

export const toTitleCase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const generateEightNumbers = () => {
  return Math.floor(Math.random()*1000000000).toString();
}