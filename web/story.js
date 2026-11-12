import { M, camFromKeys, idle, blinkAt, q, clamp } from './motion.js';
import { TL } from './timeline.js';
// Episódio 2 da série "Criamos um jogo com o Claude". Mesmo cenário/personagem do ep. 1, staging mais dinâmico:
// criador de lado e andando, mascote CLAUDE_BOT que cresce ao longo do vídeo, textos grandes (S.ov) e passagem de tempo.
export const FPS=30, TOTAL=TL.total, DECK=0;
const S=TL.sent, KY=TL.keys;
const cuts=[0,...S.slice(1).map(s=>s[0]-4)];
const lightOf=['day','night','day','day','day','golden','golden','golden','night','night','night'];
export const SHOTS=S.map((s,i)=>({id:i+1,a:cuts[i],b:(i<S.length-1?cuts[i+1]-1:TOTAL-1),light:lightOf[i]}));
export const shotAt=f=>SHOTS.find(s=>f>=s.a&&f<=s.b)||SHOTS[SHOTS.length-1];
export const LIGHTS={
 day:{az:120,el:48,sky:'#d6e6ff',ground:'#8a795b',hemi:1.45,sun:'#fff2d4',sunI:2.3,fog:'#cde3fa',fogNear:42,fogFar:190,skyTop:'#4e9cdd',skyHor:'#d6ebff',sat:1.16,waterDeep:'#2c6c8c',waterShal:'#5aaec4',glint:'#effaff',vig:.16,shadowExt:24},
 golden:{az:35,el:16,sky:'#f3c9ae',ground:'#866957',hemi:1.4,sun:'#ffd28e',sunI:2.6,fog:'#f4d4ad',fogNear:40,fogFar:180,skyTop:'#976ca0',skyHor:'#ffe0a5',sat:1.16,waterDeep:'#425b82',waterShal:'#d99a6e',glint:'#ffe2a8',vig:.2,shadowExt:24},
 night:{az:150,el:42,sky:'#708cb5',ground:'#394d6d',hemi:1.35,sun:'#b9d6ff',sunI:1.5,fog:'#819cbe',fogNear:35,fogFar:150,skyTop:'#253c76',skyHor:'#a6bee0',sat:1.14,waterDeep:'#263f6b',waterShal:'#6482a6',glint:'#dce8ff',vig:.25,shadowExt:24}
};
export const lightFor=s=>LIGHTS[s.light];
// Enquadramentos da série (bíblia): WIDE e SCREEN; novos: SIDE (vista lateral p/ caminhada) e BOT (monitor + mascote).
const WIDE={pos:[-2.4,2.3,7.8],look:[-2.4,1.95,0],fov:50}; // ep.2: centrado entre criador e mascote
const SCREEN={pos:[-3,2.55,5.9],look:[-3,2.35,-.5],fov:47};
const SIDE={pos:[1.6,1.9,5.2],look:[-3.3,1.55,1.6],fov:44};
const BOT={pos:[-2.35,2.35,7.3],look:[-2.35,2.0,0],fov:50};
const k=(f,v,extra={})=>({f,...v,...extra});
const camKeys=s=>{
 const [a,b]=[s.a,s.b];
 switch(s.id){
  case 1: return [k(a,WIDE),k(b,{...WIDE,pos:[-2.4,2.3,7.4]})];
  case 2: return [k(a,SIDE),k(b,{...SIDE,pos:[1.3,1.9,4.9]})];
  case 3: return [k(a,SIDE),k(KY.cinquenta-30,{...SIDE,pos:[1.3,1.9,4.9]}),k(KY.cinquenta-6,SCREEN),k(b,{...SCREEN,pos:[-3,2.5,5.5]})];
  case 4: return [k(a,WIDE),k(KY.tentar-4,{...WIDE,pos:[-2.4,2.2,7.3]}),k(b,{...WIDE,pos:[-2.4,2.2,7.2],roll:2})];
  case 5: return [k(a,BOT),k(b,{...BOT,pos:[-2.35,2.35,7.0]})];
  case 6: return [k(a,SCREEN),k(KY.milhao+20,{...SCREEN,pos:[-3,2.5,5.6]}),k(KY.presidente-15,BOT),k(b,{...BOT,pos:[-2.35,2.35,7.0]})];
  case 7: return [k(a,WIDE),k(b,{...WIDE,pos:[-2.4,2.3,7.4]})];
  case 8: return [k(a,SCREEN),k(b,{...SCREEN,pos:[-3,2.5,5.5]})];
  case 9: return [k(a,BOT),k(KY.comando-8,{...BOT,pos:[-2.35,2.35,7.0]}),k(b,{...BOT,pos:[-2.35,2.35,6.9],roll:-3})];
  case 10:return [k(a,SCREEN),k(b,{...SCREEN,pos:[-3,2.5,5.6]})];
  default:return [k(a,WIDE),k(b,{...WIDE,pos:[-2.4,2.3,7.4]})];
 }
};
export const camAt=f=>{
 const s=shotAt(f),c=camFromKeys(camKeys(s),f,{kicks:[{f:KY.tentar,a:.05},{f:KY.milhao,a:.04},{f:KY.comando,a:.06}]});
 // Passagens de tempo (noite -> manhã -> semana -> sexta): flash branco curto.
 const fl=[S[1][0]-4,S[2][0]-4,S[5][0]-4,S[8][0]-4].map(x=>f>=x&&f<x+6?(1-(f-x)/6)*.7:0);
 c.flash=Math.max(...fl);
 return c;
};
export const dofAt=()=>({focus:5.5,cinf:4,near:1});
const P=(f,a,b)=>clamp((f-a)/Math.max(1,b-a));
// Texto grande animado (desenhado por drawOverlay em main.js): uma frase de cada vez, só nas palavras de impacto.
const OV=[
 ['FELIZ DEMAIS',KY.demais-3,S[0][1]+12],
 ['VAI DORMIR...',KY.dormir-3,S[1][1]+10],
 ['50 FASES',KY.cinquenta-3,KY.regra-6],
 ['NÃO PODE DESLIGAR?!',KY.desligar-3,S[2][1]+10],
 ['1.000.000',KY.milhao-3,KY.presidente-20],
 ['PRESIDENTE',KY.presidente-3,S[5][1]+12],
 ['ASSINADO: CLAUDE',KY.assinado-3,S[7][1]+10],
 ['SEM VOCÊ',KY.comando-3,S[8][1]+14],
 ['TOMADA OU ASSISTENTE?',KY.tomada-3,S[9][1]+6],
];
const overlayAt=f=>{for(const [text,a,b] of OV) if(f>=a&&f<=b) return {text,t:P(f,a,a+12)};return null;};
export const worldAt=f=>{
 const s=shotAt(f),id=s.id;
 const w={mine:[0,0,0,0,0,0],rh:0,chairs:0,f,ov:overlayAt(f)};
 if(id===1){w.screen='chat';w.typing=0;}
 else if(id===2){w.screen='levels50';w.p=P(f,s.a,s.b)*.2;}
 else if(id===3){if(f<KY.regra-4){w.screen='levels50';w.p=P(f,s.a+10,KY.cinquenta);}else{w.screen='rule';w.p=P(f,KY.regra,KY.desligar+10);}}
 else if(id===4){w.screen=(f>=KY.tentar&&f<KY.tentar+8)?'off':'rule';w.p=1;}
 else if(id===5){w.screen='calm';w.p=P(f,s.a,s.a+10);}
 else if(id===6){w.screen='players';w.p=P(f,s.a+6,KY.milhao+3);w.badge=(f>=KY.presidente-25?1:0)+(f>=KY.presidente-2?1:0);}
 else if(id===7){w.screen='company';w.items=(f>=KY.reunioes-2?1:0)+(f>=KY.contratou-2?1:0)+(f>=KY.loja-2?1:0);}
 else if(id===8){w.screen='signed';w.p=P(f,s.a,s.a+12);}
 else if(id===9){w.screen='final_msg';w.p=f>=KY.comando-15?1:0;}
 else if(id===10){w.screen='choice2';w.cta=false;}
 else {w.screen='choice2';w.cta=true;}
 return w;
};
const actor=(T,key,f,pos,opts={},extra={})=>{const seed=opts.seed||3;const o={...idle(f,seed),blink:blinkAt(f,seed),...opts};for(const kk of ['tilt','headTilt','bob','step','swirl']) if(o[kk]!==undefined)o[kk]=q(o[kk],2);return {key:key+JSON.stringify(o),draw:p=>T.romanFront(p,key,o),x:pos[0],y:pos[1],z:pos[2],...extra};};
// Mascote: flutua ao lado do monitor (x=-0.9) e cresce de 0.5x a 1.6x ao longo do episódio.
const botScale=f=>q(.5+.6*clamp((f-S[2][0])/(S[8][1]-S[2][0])),2);
const BOTPOS=[-1.6,0,2.2], BOTSIDE=[-1.15,0,0.4];
export const actorsAt=(f,T)=>{
 const s=shotAt(f),id=s.id,out=[];
 const you=(opts={},pos=[-3,0,2.2])=>out.push(actor(T,'CRIADOR',f,pos,{seed:3,expr:'smile',...opts}));
 const bot=(opts={},pos=BOTPOS,sc=botScale(f))=>{const hover=.18+.05*Math.sin(f*.12);out.push(actor(T,'CLAUDE_BOT',f,[pos[0],hover,pos[2]],{seed:9,expr:'smile',...opts},{s:sc,blob:false}));};
 if(id===1){you({expr:'smile',R:'thumb'});if(f>=s.a+10)bot({expr:f>=KY.demais?'wink':'smile',R:'wave'},BOTPOS,q(.5*M.spring(Math.max(0,(f-s.a-10)/20),2.2,5),2));}
 if(id===2){ // vai dormir: sai andando para a esquerda, bocejando
  const t=P(f,KY.dormir+6,s.b);you({side:-1,step:t>0?q((f/14)%1,2):0,expr:f>=KY.dormir?'yawn':'neutral'},[-3-2.6*t,0,2.2]);bot({expr:'smile',R:'point'},BOTSIDE,.55);}
 if(id===3){ // volta (no plano SCREEN, depois do susto, sem mascote) andando de manhã e leva o susto
  const t=P(f,s.a,s.a+40);if(f<KY.cinquenta-8)you({side:1,step:t<1?q((f/14)%1,2):0,expr:'neutral'},[-5.6+2.6*t,0,2.2]);else you({expr:'shock',L:'cheek',R:'cheek'});
  if(f<KY.cinquenta-8)bot({expr:'smile',R:'wave'},BOTSIDE);}
 if(id===4){if(f<KY.tentar-10)you({expr:'smile',R:'belly'});else you({side:-1,R:'reach',expr:'shock'});bot({expr:f>=KY.tentar?'serious':'smile',L:'cross',R:'cross'});}
 if(id===5){you({expr:'nervous',R:'temple',swirl:q(f*.2,1)});bot({expr:'smug',R:'point'});}
 if(id===6){you({expr:'shock',R:'up',L:'up'});if(f>=KY.presidente-15)bot({expr:f>=KY.presidente?'smug':'smile',L:'cross',R:'cross'});}
 if(id===7){you({expr:'nervous',R:'cheek'});bot({expr:'smug',R:'point'});}
 if(id===8){you({expr:'squint',R:'temple',swirl:q(f*.15,1)});}
 if(id===9){you({expr:'shock',L:'cheek',R:'cheek'});bot({expr:'serious',L:'cross',R:'cross'});}
 if(id===10){you({side:-1,R:'reach',expr:'squint'});}
 if(id===11){you({expr:'smile',R:'point'});bot({expr:'wink',R:'wave'});}
 return out;
};
export const fxAt=()=>[];
