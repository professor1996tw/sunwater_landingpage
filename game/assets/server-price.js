(function(){
  var SHEET_ID='1ujUTvJcHLN7MTMLJrbuLX_m789syksY0cSPmKw175yY';
  var PRICE_CSV_URL='https://docs.google.com/spreadsheets/d/'+SHEET_ID+'/export?format=csv&gid=0';
  var HISTORY_SHEET_ID='1AjGfuoODgDwAmySJXnadfNbqby_olJx1gz-hx_TCPUo';
  var HISTORY_CSV_URL='https://docs.google.com/spreadsheets/d/'+HISTORY_SHEET_ID+'/export?format=csv&gid=0';
  var DISPLAY_DAYS=5;
  var SERVER=(window.SV_SERVER||'').trim();
  function stripPrefix(n){ return n.replace(/^\d+[\.．\s]+/,'').trim(); }
  function pad(n){ return String(n).padStart(2,'0'); }
  var historyData=null;
  function fetchHistory(){
    return fetch(HISTORY_CSV_URL).then(function(r){return r.text();}).then(function(text){
      var rows=text.split('\n').slice(1); var cutoff=Math.floor(Date.now()/1000)-DISPLAY_DAYS*86400; var arr=[];
      rows.forEach(function(row){ var c=row.split(',');
        if(c.length>=3){ var s=c[0].trim().replace(/^"|"$/g,''); var tsRaw=c[1].trim().replace(/^"|"$/g,''); var v=parseFloat(c[2]);
          if(!s||isNaN(v)||stripPrefix(s)!==SERVER) return; var ts;
          if(/^\d{10,}$/.test(tsRaw)){ts=parseInt(tsRaw);} else { var d=new Date(tsRaw); if(isNaN(d.getTime()))return; ts=Math.floor(d.getTime()/1000);}
          if(ts<cutoff) return; arr.push({time:ts,value:v}); } });
      arr.sort(function(a,b){return a.time-b.time;}); historyData=arr;
    }).catch(function(e){ console.warn('history',e); });
  }
  function drawChart(){
    var c=document.getElementById('svChart'); if(!c||!window.LightweightCharts) return;
    if(!historyData||!historyData.length){ c.innerHTML='<div class="sv-nodata">暫無走勢數據</div>'; return; }
    c.innerHTML='';
    var chart=LightweightCharts.createChart(c,{ width:c.clientWidth,height:c.clientHeight,
      layout:{background:{type:'solid',color:'transparent'},textColor:'rgba(255,255,255,0.5)',fontSize:12},
      grid:{vertLines:{color:'rgba(255,255,255,0.05)'},horzLines:{color:'rgba(255,255,255,0.05)'}},
      rightPriceScale:{borderColor:'rgba(255,255,255,0.1)'},
      timeScale:{borderColor:'rgba(255,255,255,0.1)',timeVisible:true,secondsVisible:false},
      crosshair:{mode:0},handleScroll:false,handleScale:false });
    var s=chart.addAreaSeries({lineColor:'#C8963E',topColor:'rgba(200,150,62,0.3)',bottomColor:'rgba(200,150,62,0.02)',lineWidth:2});
    s.setData(historyData); chart.timeScale().fitContent();
    window.addEventListener('resize',function(){ try{chart.applyOptions({width:c.clientWidth,height:c.clientHeight});}catch(e){} });
  }
  function fetchPrice(){
    return fetch(PRICE_CSV_URL).then(function(r){return r.text();}).then(function(text){
      var rows=text.split('\n').slice(1);
      for(var i=0;i<rows.length;i++){ var c=rows[i].split(',');
        if(c.length<8) continue; var name=c[0].trim().replace(/^"|"$/g,'');
        if(!name||stripPrefix(name)!==SERVER) continue;
        var rate=c[1].trim().replace(/^"|"$/g,''); var price=c[7].trim().replace(/^"|"$/g,'');
        var volume=c.length>=12?c[11].trim().replace(/^"|"$/g,''):'';
        var rEl=document.getElementById('svRate'); if(rEl&&rate) rEl.textContent=rate;
        var vEl=document.getElementById('svVolume'); if(vEl){ var vn=parseFloat(volume); vEl.textContent=(!isNaN(vn))?('天幣量 '+vn+' 萬顆'):''; }
        var pn=parseFloat(price);
        if(!isNaN(pn)){ var ld=document.getElementById('svLd'); if(ld){ try{ var o=JSON.parse(ld.textContent); if(o.offers){o.offers.price=String(pn);} ld.textContent=JSON.stringify(o);}catch(e){} } }
        break; }
      var now=new Date(); var up=document.getElementById('svUpdated');
      if(up) up.textContent='最後更新：'+now.getFullYear()+'/'+pad(now.getMonth()+1)+'/'+pad(now.getDate())+' '+pad(now.getHours())+':'+pad(now.getMinutes());
    }).catch(function(e){ console.error('price',e); });
  }
  fetchHistory().then(fetchPrice).then(drawChart);
  setInterval(fetchPrice, 5*60*1000);
})();