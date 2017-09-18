let calculateSuperTrend=function(data,Multiplier){
for (var p = 0; p < data.length; p++) {
    //var d = f[p];
    if (data[p]) {
        var m = (data[p].high + data[p].low) / 2;
        , v = (Multiplier * data[p].atr_superTrend)
        , g = m - v
        , x = m + v;
                        
        p && 
        (
            data[p-1] 
            && data[p-1].close 
            && (data[p-1].close > data[p-1]["_uptrend"]) 
            && (data[p-1]["_uptrend"] > g) 
            && (g = data[p-1]["_uptrend"]),

            data[p-1] 
            && data[p-1].close 
            && (data[p-1].close < data[p-1]["_downtrend"]) 
            && (data[p - 1]["_downtrend"] < x) 
            && (x = data[p-1]["_downtrend"])
        ),

        
        data[p]["direction_supertrend"] = 1,
        
        p && 
        (  data[p]["direction_supertrend"] 
            = data[p-1]["direction_supertrend"],
          (data[p].close > data[p - 1]["_downtrend"]) 
          ? data[p]["direction_supertrend"] = 1 
          : (data[p].close > data[p - 1]["_uptrend"]) 
          && (data[p]["direction_supertrend"] = -1)
        ),



        data[p]["_uptrend"] = g,

        data[p]["_downtrend"] = x,

        data[p]["trend"] = (data[p]["direction_supertrend"] > 0) ? g : x,
        

        p && 
        (  
            (data[p - 1]["direction_supertrend"] > 0)  
            ? data[p - 1]["_downtrend"] = null 
            : data[p - 1]["_uptrend"] = null,

           (data[p]["direction_supertrend"] >  0) 
           ? data[p]["_uptrend"] = g 
           : data[p]["_downtrend"] = x)
    }
}
}