const formatDate = (utcDate) => {
  if (utcDate) {
    let date = new Date(Date.parse(utcDate));
    let day = date.toLocaleString("en-us", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return day;
  } else {
    return "Invalid Date";
  }
};

const formatDateTime = (utcDate) => {
  if (utcDate) {
    let date = new Date(Date.parse(utcDate));
    let day = date.toLocaleString("en-us", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return day;
  } else {
    return "Invalid Date";
  }
};

const formatTime = (utcDate) => {
  let time = "Invalid Date";
  if (utcDate) {
    let date = new Date(Date.parse(utcDate));
    time = date.toLocaleString("en-us", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return time;
};

const convertToHour = (minutes) => {
  let time = `Invalid Input`;
  if (Number.isInteger(minutes)) {
    let minMod = minutes % 60;
    let formatMin = minMod < 10 ? "0" + minMod : minMod;
    time = `${Math.floor(minutes / 60)}:${formatMin}`;
  }
  return time;
};

const verifyDateOrder = (begin, end) => {
  let beginDate = new Date(begin);
  let endDate = new Date(end);
  let result = false;
  if (endDate > beginDate) {
    result = true;
  } else if (+endDate === +beginDate) {
    result = "same day";
  }
  return result;
};

const addDays = (date, days) => {
  const newDate = new Date(date);

  newDate.setDate(newDate.getDate() + days);

  const DD = newDate.getDate();
  const MM = newDate.getMonth() + 1;
  const YYYY = newDate.getFullYear();
  const HH = newDate.getHours();
  const mm = newDate.getMinutes();

  return `${MM}/${DD}/${YYYY} ${HH}:${mm}`;
};

const formatDateInput = (utcDate) => {
  if (utcDate) {
    let date = new Date(Date.parse(utcDate));
    const YYYY = date.getUTCFullYear();
    const MM =
      date.getUTCMonth() + 1 < 10
        ? `0${date.getUTCMonth() + 1}`
        : date.getUTCMonth() + 1;
    const DD =
      date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate();

    return `${YYYY}-${MM}-${DD}`;
  } else {
    return "Invalid Date";
  }
};

const stringifyTime = (time) => {
  const hour = Number(time.slice(0, 2));
  const minutes = Number(time.slice(3, 5));
  let stringifiedTime = "";
  if (hour === 0) {
    stringifiedTime = `${minutes} minutes`;
  } else if (minutes === 0) {
    stringifiedTime = `${hour} hour(s)`;
  } else {
    stringifiedTime = `${hour} hour(s), ${minutes} minutes`;
  }
  return stringifiedTime;
};

export {
  formatDate,
  formatDateTime,
  formatTime,
  convertToHour,
  verifyDateOrder,
  addDays,
  formatDateInput,
  stringifyTime,
};
