import { datePickerDateFormats } from "../../../public_api";

export class DatePickerSpecHelpers {
    public static getValidDatesTestCases(): string[] {
        return [
            "10-1-1988",
            "4-12-2000",
            "11-02-88",
            "7-10-99",

            "10/1/1988",
            "4/12/2000",
            "11/02/88",
            "7/10/99",

            "10.01.1988",
            "4.12.2000",
            "01.2.88",
            "7.10.99",

            "10 1 1988",
            "4 12 2000",
            "01 02 88",
            "7 10 99",

            "6 Apr 1999",
            "16 Apr 1999",
            "01 Oct 82",
            "12 Oct 82",

            "2nd Sep 18",
            "3rd Aug 2018",

            "Nov 1, 18",
            "Nov 11, 18",
            "Jun 01, 2018",
            "Jun 11, 2018",

            "Dec 1st, 18",
            "Mar 10th, 2018",
        ];
    }

    public static getInvalidDatesTestCases(): string[] {
        return [
            "   ",
            "abcdefg",
            "112233",
            "!@#$%^&*()_+",

            "10.01.1988 AD",
            "2019",
            "25 Oct",
            "24.10.2025",
            "03.32.1999",
            "04.03.20199",
            "022.033.2019",
            "Novv 10th, 2018",
            "Dec 2n, 2018",

            "1999-Feb-5",
            "2000-5-15",
            "99-5-25",
            "1988-Nov-5",
            "88-Nov-5",
            "6-Apr-1999",
            "1-Oct-82",

            "1999/Feb/5",
            "2000/5/15",
            "88/Nov/5",
            "99/5/25",
            "6/Apr/1999",
            "1/Oct/82",

            "2000 5 15",
            "99 5 25",
            "1999 Feb 5",
            "88 Nov 5",

            "2000.5.15",
            "99.5.25",
            "1999.Feb.5",
            "88.Nov.5",
            "6.Apr.1999",
            "1.Oct.82",

            "2018 Mar 10th",
            "2010 12th Oct",
            "2012 Jul 9",
            "2015 9 Sep",
        ];
    }

    public static getValidDateFormatsTestCases(): string[] {
        return datePickerDateFormats;
    }

    public static getInvalidDateFormatsTestCases(): string[] {
        return [
            "D, MMM YY",
            "DD MMM, YY",
            "YYYY DD MMM",
            "Do YY MMM",
            "MMM YYYY DD",
            "YYYY MMM Do",

            "M.D/YY",
            "M/D-YYYY",
            "MM DD.YY",
            "MM/DD YYYY",
            "MM.DD YY",

            "YY-M-D",
            "YYYY.MM.DD",
            "YY/M/D",
            "YYYY MM DD",
        ];
    }
}
