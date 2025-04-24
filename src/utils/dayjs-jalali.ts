import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/fa";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Extend Dayjs with Jalaliday plugin
dayjs.extend(jalaliday);

// Locale can be set globally (optional)
dayjs.locale("fa");

export default dayjs;
