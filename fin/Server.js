/**
 * Created by Andrei on 23.12.2015.
 */

var http = require('http');
var connect = require('connect');
var io = require('socket.io').listen(1234).sockets;

var clients1=[];
var joc=[];
var piese=[];
var scor=[];

function findById(source, id) {
    for (var i = 0; i <= source.length; i++) {
        if (source[i].id == id) {
            return i;
        }
    }
    throw "Couldn't find object with id: " + id;
}
function gasestePartener(id){
    var nr=joc.length;
    if(clients1.length%2==1) {
        joc[nr]=[];
        joc[nr][0]=socket.id;
    }
    else
        joc[nr-1][1]=socket.id;
}
function splitCarti(nr,nr1,nr2)
{
    var randomnumber;
    clients1[nr1].emit('pieseStart', {mesaj: 1 });
    clients1[nr2].emit('pieseStart', {mesaj: 0 });
    var toSend=[];
    for(var i=0;i<5;i++)
        {
            var ok=0;
            randomnumber=Math.floor(Math.random()*28);
          if(piese[nr][randomnumber]!=0)
            {
               i--;
            }
            else {
              if ([0,7,13,18,22,25,27].indexOf(randomnumber) > -1)
              ok=1;
              if(i==4&&ok==0)
              i--;
              else {
                  piese[nr][randomnumber] = 1;
                  console.log('numarul: ' + randomnumber);
                  toSend.push(randomnumber);
              }
          }

        }
    clients1[nr1].emit('pieseStart', {p1: toSend[0], p2:toSend[1],p3:toSend[2],p4:toSend[3],p5:toSend[4]});

    for(var i=0;i<5;i++)
    {
        randomnumber=Math.floor(Math.random()*28);
        if(piese[nr][randomnumber]!=0)
        {
            i--;
        }
        else {
            piese[nr][randomnumber] = 1;
            console.log('numarul: '+randomnumber);
            toSend.push(randomnumber);
        }
    }
    clients1[nr2].emit('pieseStart', {p1: toSend[5], p2:toSend[6],p3:toSend[7],p4:toSend[8],p5:toSend[9]});
}
io.on('connection', function(socket) {
    console.log(clients1.length);
    clients1.push(socket);
    console.log('nr clienti: '+clients1.length);
    var nr=joc.length;
    if(clients1.length%2==1) {
        var nr=joc.length;
        joc[nr]=[];
        scor[nr]=[];
        scor[nr][0]=0;
        scor[nr][1]=0;
        piese[nr]=[];
        for(var i=0;i<27;i++)
        piese[nr][i]=0;
    joc[nr][0]=socket.id;
        joc[nr][1]=-1;
        console.log('am inceput un nou joc: '+joc.length);
    }
    else
    {
        console.log('am adaugat la joc: '+' sockid '+clients1[0].id+' sock2 '+clients1[1].id);
        joc[nr-1][1]=socket.id;
        var nrClient1=findById(clients1,joc[nr-1][1]);
        clients1[nrClient1].emit('start', {mesaj: 4 });
        var nrClient2=findById(clients1,joc[nr-1][0]);
        clients1[nrClient2].emit('start', {mesaj: 4 });
        splitCarti(nr-1,nrClient1,nrClient2);

    }

    /*if(clients.length>=2) {
        joc[0][1] = clients[1].id;
        clients[0].emit('input', {mesaj: 'mesaj pt client ' });
        clients[0].emit('input', {mesaj: 'mesaj 2 pt client ' });

    }
    else
    clients[0][0]=clients[0].id;
    clients[0].emit('input', {mesaj:4 });
*/


    /*if(clients.length>=2) {
        var nrClient=findById(clients,)
        socket.emit('input', {mesaj: 'mesaj pt client ' + clients[0].id});
    }*/
    socket.on('mutare',function(data){
        var piesa=data.piesa;
        var x=data.cordx;
        var y=data.cordy;
        var u1=data.used1;
        var u2=data.used2;
        var as1=data.astup;
        var as2=data.astupP;

        var id;
        console.log(piesa);
        console.log(x);
        console.log(y);
        var val=indexOfId(joc,socket.id);
        if(joc[val][0]==socket.id)
        {
            id= joc[val][1];
        }
        else id=joc[val][0];
        var nrClient=findById(clients1,id);
        clients1[nrClient].emit('mutare', {piesa:piesa,cordx:x,cordy:y,used1:u1,used2:u2,astup:as1,astupP:as2});


        /*   console.log('asd asd as');
         console.log(client);
         client.on('disconnect', function() {
         clients.splice(clients.indexOf(client), 1);*/
    });
    socket.on('castigat',function(data){

        var val=indexOfId(joc,socket.id);
        if(joc[val][0]==socket.id)
        {
            id= joc[val][0];
            id2= joc[val][1];
        }
        else {
            id=joc[val][1];
            id2=joc[val][0];
        }
        var nrClient1=findById(clients1,id);
        var nrClient2=findById(clients1,id2);
        clients1[nrClient1].emit('end', {p: 1});
        clients1[nrClient2].emit('end', {p: 0});


    });
    socket.on('DrawCard',function(data){

        var randomnumber;
        var ps;
        var id;
        var id2;
        for(var i=0;i<1;i++)
        {
            randomnumber=Math.floor(Math.random()*28);
            if(piese[0][randomnumber]!=0) {
                i--;
            }
            else{
                piese[0][randomnumber] = 1;
                ps=randomnumber;
                console.log('dau o piesa '+ps);
            }



        }
        var val=indexOfId(joc,socket.id);
        if(joc[val][0]==socket.id)
        {
            id= joc[val][0];
            id2= joc[val][1];
        }
        else {
            id=joc[val][1];
            id2=joc[val][0];
        }
        var nrClient1=findById(clients1,id);
        var nrClient2=findById(clients1,id2);
        clients1[nrClient1].emit('GetCard', {p: ps});
        //clients1[nrClient2].emit('changeTurn', {p: -1});
        //clients1[1].emit('GetCard', {p: ps});


    });

    socket.on('disconnect', function() {
        console.log('Got disconnect!');
         var i = clients1.indexOf(socket);
        console.log('idul clientului sters '+i+' din '+clients1.length);
        clients1.splice(i,i+1);
        for(var j=0;j<clients1.length;j++)
            clients1[j].emit('input', {mesaj: 'esti inca conectat' });
        console.log('un jucator a plecat: '+clients1.length+' socketid '+ socket.id);
        var idLeft;

        var val=indexOfId(joc,socket.id);
        if(joc[val][0]==socket.id)
        {
           idLeft= joc[val][1];
        }
        else idLeft=joc[val][0];
        joc.splice(val,val+1);

       var ok=0;
        for(var i=0;i<joc.length;i++)
        if(joc[i][1]==-1)
        {
            console.log('lungimea jocului acum: '+joc.length+' si Iul: '+i);
            joc[i][1]=idLeft;
            var nrClient=findById(clients1,idLeft);
            clients1[nrClient].emit('input', {mesaj: nr-1 });
       ok=1;
            console.log('am adaugat in joc: ');
        }
        if(ok==0)
        {
            console.log('am inceput un nou joc: '+joc.length);
            var nr=joc.length;
            joc[nr]=[];
            joc[nr][0]=idLeft;
            joc[nr][1]=-1;

        }


        //clients.pop(socket);*/
        console.log(clients1.length);

    });

    socket.on('input',function(data){
        var mesaj=data.mesaj;
        console.log(mesaj);
   /*   console.log('asd asd as');
    console.log(client);
    client.on('disconnect', function() {
        clients.splice(clients.indexOf(client), 1);*/
    });
});

function indexOfId(array, id) {
    for (var i=0; i<=joc.length; i++) {
        if (joc[i][0]==id || joc[i][1]==id) return i;
    }
    return -1;

}

/*
var app=connect();
function doFirst(request, response,next) {
    console.log('asda asd asd sadas');
    next();
}
function doSecond(request, response,next) {
    console.log('doi');
    next();
}
app.use(doFirst);
app.use(doSecond);

function onRequest(request, response) {
console.log("Un utiizator a facut un request "+request.url);
    response.writeHead(200,{"Context-Type":"text/plain"});
    response.write("Here is some data");
    response.end();
}

http.createServer(app).listen(1234);
console.log('Serverul e pornit');
/*
function place(nr) {
    console.log('S-a plasat: ',nr);
    livreaza(function(){console.log('am livrat numarul la bd ')})
}
function livreaza(callback) {
setTimeout(callback,5000);
}

place(1);
place(2);
place(3);
place(4);
place(5);*/