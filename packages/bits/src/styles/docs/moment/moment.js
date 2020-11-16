Nui.app().controller("MomentDemoController", [
    function () {
        var that = this;

        that.dates = {
            date1: "moment().format('MMMM Do YYYY, h:mm:ss a')",
            date2: "moment().format('dddd')",
            date3: "moment().format('MMM Do YY')",
            date4: "moment().format('YYYY [escaped characters] YYYY')",
            date5: "moment().format()"
        };

        that.times = {
            time1: "moment('20111031', 'YYYYMMDD').fromNow()",
            time2: "moment().startOf('day').fromNow()",
            time3: "moment().endOf('day').fromNow()",
            time4: "moment().startOf('hour').fromNow()",
            time5: "moment([2016, 10]).diff(moment([2016, 8]), 'days')"
        };

        that.calendars = {
            calendar1: "moment().subtract(10, 'days').calendar()",
            calendar2: "moment().subtract(6, 'days').calendar()",
            calendar3: "moment().subtract(3, 'days').calendar()",
            calendar4: "moment().subtract(1, 'days').calendar()",
            calendar5: "moment().calendar()",
            calendar6: "moment().add(1, 'days').calendar()",
            calendar7: "moment().add(3, 'days').calendar()",
            calendar8: "moment().add(10, 'days').calendar()"
        };

        that.getValue = function (string) {
            // this is not a nice way, but otherwise whe would need to create a new directive
            return eval(string)
        };
    }
]);
