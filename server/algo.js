var obj = {
    L1c: function(t, n) {
        return t < n
    },
    t1c: function(t, n) {
        return t < n
    },
}
Supertrend: {
        name: mi + s6p6e.r90 + s6p6e.s30 + s6p6e.C7m + Un + Fa + s6p6e.C7m + br,
        overlay: Nr,
        seriesFN: Ja.Studies.displaySupertrend,
        calculateFN: Ja.Studies.calculateSupertrend,
        inputs: {
            Period: j,
            Multiplier: s6p6e.e90
        },
        outputs: {
            Uptrend: Zn + Cn + Ta + M + zn,
            Downtrend: Zn + s6p6e.A4m + Cn + la + W + Ta
        },
        attributes: {
            Multiplier: {
                min: vn,
                step: vn
            }
        }
    },

    supertrend = function() {
        if (data.length < no_days + 1) {
            console.log(error)
        } else {
            var data={
              ATR Supertrend (7,3):0.72597900
              Close:287.1,
              DT:Mon Jun 19 2017 07:45:00 GMT+0400 (Arabian Standard Time) {},
              Date:"20170619074500000",
              High:287.25,
              Low:285.45,
              MA ma (2,ema,0,y):191.4,
              MA ma (50,ma,0,n):null,
              Open:286.65,
              Signal macd (12,26,9):null,
              Volume:1344856,
              displayDate:Mon Jun 19 2017 09:15:00 GMT+0400 (Arabian Standard Time) {},
              hl/2:286.35,
              hlc/3:286.6,
              hlcc/4:286.725,
              iqPrevClose:287.1,
              ohlc/4:286.61249999999995,
              ratio:1,
              _MACD1 macd (12,26,9):44.16923076923077,
              _MACD2 macd (12,26,9):21.266666666666666,
              Sum True Range Supertrend (7,3):7.199999999999989,
              True Range Supertrend (7,3):0.8999999999999773,
              trueRange:0.8999999999999773,
              _uptrend:0,
            }

            for (var i = 0; i < data.length; i++) {
                var d = data[i]
                if (d) {
                    var m = (day_high + day_low) / 2;
                    var v = boolean(Multiplier < atr_superTrend);
                    var g = m - v;
                    var x = m + v;

                    if(i && data[i-1] && data[i-1].Close &&  data[i-1].Close> data[i-1]["_uptrend"]  && (data[i-1]["_uptrend"] < g)){     
                      g=(data[i-1]["_uptrend"])
                    }

                    if(data[i-1] && data[i-1].Close && data[i-1].Close <  data[i-1]["_downtrend"] && (data[i-1]["_downtrend"] < x)){
                     x=(data[i-1]["_downtrend"]) 
                    }           
                    d["direction_supertrend"]=1;

                    if(i && )


                }
            }
        }

    }
Ja.Studies.calculateSupertrend = function(t, n) {
    var e = "Up",
        r = "Dow",
        i = "Dire",
        a = "rec",
        s = "recti",
        o = "ren",
        u = "wnt",
        l = "ptren",
        c = "_U",
        h = "pt",
        f = n.chart.scrubbed;

    if (obj.L1c(f.length, n.days + 1))
        return void(n.error = !0);
    Ja.Studies.calculateStudyATR(t, n);
    for (var p = n.startFrom; s6p6e.t1c(p, f.length); p++) {
        var d = f[p];
        if (d) {
            var m = s6p6e.D5c(d.High + d.Low, 2),
                v = s6p6e.U5c(n.inputs.Multiplier, d[xi + Ma + Ka + n.name]),
                g = s6p6e.p5c(m, v),
                x = m + v;

              
            && f[s6p6e.b5c(p, 1)].Close 
            && s6p6e.h5c(f[p - 1].Close, f[p - 1][xa + Tr + s6p6e.s30 + ja + Fa + s6p6e.C7m + s6p6e.v30 + s6p6e.Y7m + Ka + n.name]) 
            && s6p6e.V5c(f[p - 1][xa + Tr + h + Fa + s6p6e.C7m + s6p6e.v30 + s6p6e.Y7m + Ka + n.name], g) 
            && (g = f[s6p6e.Z5c(p, 1)][c + l + s6p6e.Y7m + Ka + n.name]),
            
            f[s6p6e.f5c(p, 1)] 
            && f[s6p6e.l5c(p, 1)].Close 
            && s6p6e.u5c(f[p - 1].Close, 

            f[p - 1][xa + _i + s6p6e.d0m + Li + Pa + Fa + s6p6e.C7m + br + Ka + n.name]) 
            && s6p6e.i5c(f[p - 1][xa + we + Li + Pa + La + br + Ka + n.name], x) 
            && (x = f[s6p6e.c5c(p, 1)][xa + _i + s6p6e.d0m + u + o + s6p6e.Y7m + Ka + n.name])),

                d[xa + _i + Ra + Fa + s6p6e.C7m + nr + Ne + s6p6e.v30 + Ka + n.name] = 1,
                p 
                && (d[xa + _i + Ra + Fa + Lr + ja + ye + Ka + n.name] = f[s6p6e.P5c(p, 1)][qe + Ra + La + Ta + ja + Ra + s6p6e.d0m + s6p6e.v30 + Ka + n.name],

                s6p6e.C5c(d.Close, f[p - 1][xa + _i + s6p6e.d0m + Li + s6p6e.v30 + ja + Fa + Ei + s6p6e.Y7m + Ka + n.name]) ? d[xe + s + Ki + Ka + n.name] = 1 : s6p6e.v5c(d.Close, f[p - 1][xa + Tr + s6p6e.s30 + Ue + s6p6e.C7m + br + Ka + n.name]) 
                && (d[xa + ge + a + ja + Ra + s6p6e.d0m + s6p6e.v30 + Ka + n.name] = -1)),


                d[xa + Tr + h + Fa + ve + Ka + n.name] = g,

                d[xa + _i + me + s6p6e.v30 + Ue + Ei + s6p6e.Y7m + Ka + n.name] = x,

                d[de + Fa + ve + Ka + n.name] = s6p6e.z5c(d[xa + i + nr + Ra + s6p6e.d0m + s6p6e.v30 + Ka + n.name], 0) ? g : x,

                p 
                && (s6p6e.J9c(f[p - 1][qe + pe + s6p6e.C7m + Ta + ja + Ne + s6p6e.v30 + Ka + n.name], 0) ? f[s6p6e.F9c(p, 1)][xa + r + s6p6e.v30 + ja + Fa + s6p6e.C7m + s6p6e.v30 + s6p6e.Y7m + Ka + n.name] = null : f[s6p6e.g9c(p, 1)][xa + e + Ue + Ei + s6p6e.Y7m + Ka + n.name] = null,

                s6p6e.s9c(f[p][xa + ge + La + Ta + ja + Ra + s6p6e.d0m + s6p6e.v30 + Ka + n.name], 0) ? f[p][e + ja + Fa + Ei + s6p6e.Y7m + Ka + n.name] = g : f[p][r + Pa + Fa + ve + Ka + n.name] = x)
        }
    }
}




//last logic
if (_direction_prev_supertrend > _direction_next_supertrend) {
    console.log("Downtrend");
} else if (_direction_prev_supertrend < direction_next_supertrend) {
    console.log("uptrend");
}