// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
