var osmInfo = require('../OsmInfo');
var url = 'https://www.openstreetmap.org/api/0.6/way/520041885';    
/*osmInfo.getInfo(url,(data)=>{
    osmInfo.write('wayDemo',data);
});*/
url = 'https://www.openstreetmap.org/api/0.6/node/4452550921';
/*osmInfo.getInfo(url,(data)=>{
    console.log(data);
    osmInfo.write('nodeDemo',data);
});*/
//relation/7641167
url = 'https://www.openstreetmap.org/api/0.6/relation/7641167';
osmInfo.getInfo(url,(data)=>{
    //console.log(data);
    osmInfo.write('relationDemo',data);
});