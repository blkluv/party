import dayjs from "dayjs";
import FormDateValues from "~/types/FormDateValues";

const dateConvert = (date: FormDateValues) => {
  return dayjs()
    .year(Number(date.year))
    .month(Number(date.month))
    .date(Number(date.day))
    .hour(date.modifier === "PM" ? Number(date.hour) + 12 : Number(date.hour))
    .minute(Number(date.minute))
    .second(0)
    .millisecond(0);
};

export default dateConvert;
