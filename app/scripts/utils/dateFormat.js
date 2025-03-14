var dateFormat = (function () {
    var t = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        e = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        a = /[^-+\dA-Z]/g,
        m = function (t, e) {
            for (t = String(t), e = e || 2; t.length < e; ) t = "0" + t;
            return t;
        };
    return function (d, n, r) {
        var y = dateFormat;
        if (
            (1 != arguments.length || "[object String]" != Object.prototype.toString.call(d) || /\d/.test(d) || ((n = d), (d = void 0)),
            (d = d ? new Date(d) : new Date()),
            isNaN(d))
        )
            throw SyntaxError("invalid date");
        "UTC:" == (n = String(y.masks[n] || n || y.masks.default)).slice(0, 4) && ((n = n.slice(4)), (r = !0));
        var s = r ? "getUTC" : "get",
            i = d[s + "Date"](),
            o = d[s + "Day"](),
            u = d[s + "Month"](),
            M = d[s + "FullYear"](),
            l = d[s + "Hours"](),
            T = d[s + "Minutes"](),
            h = d[s + "Seconds"](),
            c = d[s + "Milliseconds"](),
            g = r ? 0 : d.getTimezoneOffset(),
            S = {
                d: i,
                dd: m(i),
                ddd: y.i18n.dayNames[o],
                dddd: y.i18n.dayNames[o + 7],
                m: u + 1,
                mm: m(u + 1),
                mmm: y.i18n.monthNames[u],
                mmmm: y.i18n.monthNames[u + 12],
                yy: String(M).slice(2),
                yyyy: M,
                h: l % 12 || 12,
                hh: m(l % 12 || 12),
                H: l,
                HH: m(l),
                M: T,
                MM: m(T),
                s: h,
                ss: m(h),
                l: m(c, 3),
                L: m(c > 99 ? Math.round(c / 10) : c),
                t: l < 12 ? "a" : "p",
                tt: l < 12 ? "am" : "pm",
                T: l < 12 ? "A" : "P",
                TT: l < 12 ? "AM" : "PM",
                Z: r ? "UTC" : (String(d).match(e) || [""]).pop().replace(a, ""),
                o: (g > 0 ? "-" : "+") + m(100 * Math.floor(Math.abs(g) / 60) + (Math.abs(g) % 60), 4),
                S: ["th", "st", "nd", "rd"][i % 10 > 3 ? 0 : (((i % 100) - (i % 10) != 10) * i) % 10],
            };
        return n.replace(t, function (t) {
            return t in S ? S[t] : t.slice(1, t.length - 1);
        });
    };
})();
(dateFormat.masks = {
    default: "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
}),
    (dateFormat.i18n = {
        dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        monthNames: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
    }),
    (Date.prototype.format = function (t, e) {
        return dateFormat(this, t, e);
    });
