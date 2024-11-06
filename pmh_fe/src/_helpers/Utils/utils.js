import _ from 'underscore';

export const fasterNumberToHuman = (n, p) => {
  p = !_.isUndefined(p) ? p : 2;
  n = +n || 0;
  const s = n.toFixed(p);
  if (n >= 1000 || n <= -1000) {
    let r = s.split('.'),
      whole = r[0],
      frac = p > 0 ? '.' + r[1] : '',
      rgx = /(\d+)(\d{3})/;
    while (rgx.test(whole)) {
      whole = whole.replace(rgx, '$1,$2');
    }
    return whole + frac;
  } else {
    return s;
  }
};

export const validateEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email);
};

export const arraysAreEqual = (array1, array2) => {
  if (array1.length === array2.length) {
    return array1.every((element) => {
      if (array2.includes(element)) {
        return true;
      }

      return false;
    });
  }

  return false;
};

export const isValidUrl = (url) => {
  try {
    const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)(\?[^\s#]*)?(#[^\s]*)?$/gm;
    return urlRegex.test(url);
  } catch (e) {
    return false;
  }
};
