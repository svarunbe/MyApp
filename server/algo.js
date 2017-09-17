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
              _downtrend:0,
              direction_supertrend:0,
              trend:0,
              uptrend:0,
              downtrend:0
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

                    if(i){
                      (d["direction_supertrend"]= data[i-1]["direction_supertrend"]);
                      
                      if(d.close > data[i-1]["Downtrend"]){
                        (d["direction_supertrend"]=1)
                      }else{
                        if(d.close < data[i-1]["uptrend"]){
                          d["direction_supertrend"]=-1;
                        }
                      } 
                    
                    d["_uptrend"]=g;
                    d["_downtrend"]=x;

                    d["trend"]= d["direction_supertrend"] > 0 ? g : x;

                    if(i){
                    if( data[i - 1]["direction_supertrend"] > 0){
                      data[i-1]["_downtrend"] = null 
                    }else{
                      data[i- 1]["_uptrend"] = null
                    }

                    if(data[i]["direction_supertrend"] > 0){
                      data[i]["uptrend"] = g 
                    }else{
                      data[i]["downtrend"] = x
                    }                     
                    }
                }
            }
        }
    }




//last logic
if(index!=0){
  if (_direction_prev_supertrend > _direction_next_supertrend) {
    console.log("Downtrend");
  } else if (_direction_prev_supertrend < direction_next_supertrend) {
      console.log("uptrend");
  }  
}
