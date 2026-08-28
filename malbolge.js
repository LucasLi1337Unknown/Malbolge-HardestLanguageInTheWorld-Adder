// Original Malbolge VM for the browser.
// JS only interprets Malbolge; it does NOT perform the addition.
(() => {
  const XLAT1 = '+b(29e*j1VMEKLyC})8&m#~W>qxdRp0wkrUo[D7,XTcA"lI.v%{gJh4G\\-=O@5`_3i<?Z\';FNQuY]szf$!BS/|t:Pn6^Ha';
  const XLAT2 = '5z]&gqtyfr$(we4{WP)H-Zn,[%\\\\3dL+Q;>U!pJS72FhOA1CB6v^=I_0/8|jsb9m<.TVac`uY*MK\'X~xDl}REokN:#?G"i@';
  // xlat strings above are source literals; normalize doubled backslashes produced by JS escaping.
  const x1 = XLAT1.replace('\\\\','\\'), x2 = XLAT2.replace('\\\\','\\');

  function crazy(a,b){
    const table = [[1,0,0],[1,0,2],[2,2,1]];
    let out=0, p=1;
    for(let i=0;i<10;i++){
      const at=Math.floor(a/p)%3, bt=Math.floor(b/p)%3;
      out += table[bt][at]*p; p*=3;
    }
    return out;
  }
  function rotr(x){ return Math.floor(x/3)+(x%3)*19683; }

  window.runMalbolge = function(source,input,maxSteps=120000000){
    // Whitespace is ignored in source.
    const code=[...source].filter(ch=>ch.charCodeAt(0)>=33 && ch.charCodeAt(0)<=126);
    const mem=new Int32Array(59049);
    let n=0;
    for(const ch of code){
      const v=ch.charCodeAt(0);
      const op=x1[(v+n)%94];
      if(!'ji*p/<vo'.includes(op)) throw new Error(`Invalid Malbolge source at instruction ${n}`);
      mem[n++]=v;
    }
    if(n<2) throw new Error("Program too short");
    for(let i=n;i<59049;i++) mem[i]=crazy(mem[i-1],mem[i-2]);

    let a=0,c=0,d=0,ip=0,out="",steps=0;
    while(steps++<maxSteps){
      if(mem[c]<33 || mem[c]>126){ c=(c+1)%59049; d=(d+1)%59049; continue; }
      const oldC=c, instr=x1[(mem[c]+c)%94];
      switch(instr){
        case 'j': d=mem[d]; break;
        case 'i': c=mem[d]; break;
        case '*': a=mem[d]=rotr(mem[d]); break;
        case 'p': a=mem[d]=crazy(a,mem[d]); break;
        case '/':
          a = ip<input.length ? input.charCodeAt(ip++) : 59048;
          break;
        case '<':
          out += String.fromCharCode(a & 255);
          break;
        case 'v': return out;
        case 'o': break;
      }
      // Encrypt the instruction that was executed (the pre-jump C).
      if(mem[oldC]>=33 && mem[oldC]<=126) mem[oldC]=x2.charCodeAt(mem[oldC]-33);
      c=(c+1)%59049; d=(d+1)%59049;
    }
    throw new Error("Malbolge step limit reached");
  };
})();