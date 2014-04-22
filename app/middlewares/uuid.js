//生成唯一的id

/*


uuid.js - Version 0.2
JavaScript Class to create a UUID like identifier


Copyright (C) 2006-2008, Erik Giberti (AF-Design), All rights reserved.


This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.


This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.


You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place, Suite 330, Boston, MA 02111-1307 USA


The latest version of this file can be downloaded from
http://www.af-design.com/resources/javascript_uuid.php


HISTORY:
6/5/06  - Initial Release
5/22/08 - Updated code to run faster, removed randrange(min,max) in favor of
          a simpler rand(max) function. Reduced overhead by using getTime()
          method of date class (suggestion by James Hall).


KNOWN ISSUES:
- Still no way to get MAC address in JavaScript
- Research into other versions of UUID show promising possibilities
  (more research needed)
- Documentation needs improvement


*/

// On creation of a UUID object, set it's initial value




exports.id = function() {
  var uuid = new UUID();
  return uuid.id;
}

function UUID(){
  this.id = this.createUUID();
}


// When asked what this Object is, lie and return it's value
UUID.prototype.valueOf = function(){ return this.id; }
UUID.prototype.toString = function(){ return this.id; }


//
// INSTANCE SPECIFIC METHODS
//


UUID.prototype.createUUID = function(){
  //
  // Loose interpretation of the specification DCE 1.1: Remote Procedure Call
  // described at http://www.opengroup.org/onlinepubs/009629399/apdxa.htm#tagtcjh_37
  // since JavaScript doesn't allow access to internal systems, the last 48 bits
  // of the node section is made up using a series of random numbers (6 octets long).
  //
  var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
  var dc = new Date();
  var t = dc.getTime() - dg.getTime();
  var h = '-';
  var tl = UUID.getIntegerBits(t,0,31);
  var tm = UUID.getIntegerBits(t,32,47);
  var thv = UUID.getIntegerBits(t,48,59) + '1'; // version 1, security version is 2
  var csar = UUID.getIntegerBits(UUID.rand(4095),0,7);
  var csl = UUID.getIntegerBits(UUID.rand(4095),0,7);


  // since detection of anything about the machine/browser is far to buggy, 
  // include some more random numbers here
  // if NIC or an IP can be obtained reliably, that should be put in
  // here instead.
  var n = UUID.getIntegerBits(UUID.rand(8191),0,7) + 
      UUID.getIntegerBits(UUID.rand(8191),8,15) + 
      UUID.getIntegerBits(UUID.rand(8191),0,7) + 
      UUID.getIntegerBits(UUID.rand(8191),8,15) + 
      UUID.getIntegerBits(UUID.rand(8191),0,15); // this last number is two octets long
  return tl + h + tm + h + thv + h + csar + csl + h + n; 
}




//
// GENERAL METHODS (Not instance specific)
//




// Pull out only certain bits from a very large integer, used to get the time
// code information for the first part of a UUID. Will return zero's if there 
// aren't enough bits to shift where it needs to.
UUID.getIntegerBits = function(val,start,end){
  var base16 = UUID.returnBase(val,16);
  var quadArray = new Array();
  var quadString = '';
  var i = 0;
  for(i=0;i<base16.length;i++){
    quadArray.push(base16.substring(i,i+1));  
  }
  for(i=Math.floor(start/4);i<=Math.floor(end/4);i++){
    if(!quadArray[i] || quadArray[i] == '') quadString += '0';
    else quadString += quadArray[i];
  }
  return quadString;
}


// Numeric Base Conversion algorithm from irt.org
// In base 16: 0=0, 5=5, 10=A, 15=F
UUID.returnBase = function(number, base){
  //
  // Copyright 1996-2006 irt.org, All Rights Reserved.  
  //
  // Downloaded from: http://www.irt.org/script/146.htm 
  // modified to work in this class by Erik Giberti
  var convert = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    if (number < base) var output = convert[number];
    else {
        var MSD = '' + Math.floor(number / base);
        var LSD = number - MSD*base;
        if (MSD >= base) var output = this.returnBase(MSD,base) + convert[LSD];
        else var output = convert[MSD] + convert[LSD];
    }
    return output;
}


// pick a random number within a range of numbers
// int b rand(int a); where 0 <= b <= a
UUID.rand = function(max){
  return Math.floor(Math.random() * max);
}

// end of UUID class file