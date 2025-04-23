import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/fa";

dayjs.extend(utc);

// Extend Dayjs with Jalaliday plugin
dayjs.extend(jalaliday);

// Locale can be set globally (optional)
dayjs.locale("fa");

export default dayjs;
