'use client';
import {useEffect,useRef,useState} from 'react';
import {Download} from 'lucide-react';
import type {Keepsake} from '../lib/tarot/keepsake';
export function paintKeepsake(canvas:HTMLCanvasElement,value:Keepsake){
 const c=canvas.getContext('2d');if(!c)throw Error('图片生成暂时不可用');const width=1080,pad=92,timeWidth=190,textX=pad+timeWidth+48,textWidth=width-pad-textX;
 const sans='-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
 const wrap=(text:string,font:string,max:number)=>{c.font=font;const lines:string[]=[];let line='';for(const part of Array.from(text)){if(c.measureText(line+part).width>max&&line){lines.push(line.trim());line='';}line+=part;}if(line)lines.push(line.trim());return lines;};
 const layout=value.rows.map(r=>{const title=wrap(r.title,`500 38px ${sans}`,textWidth),detail=r.detail?wrap(r.detail,`28px ${sans}`,textWidth):[];return {...r,titleLines:title,detailLines:detail,height:Math.max(142,title.length*52+detail.length*42+54)};});
 const footerText=value.character?`${value.city}${value.locale==='en'?' with ':' · 和 '}${value.character}`:value.city;const footer=wrap(footerText,`44px ${sans}`,width-pad*2);
 canvas.width=width;canvas.height=440+layout.reduce((n,r)=>n+r.height,0)+170+footer.length*61;
 const h=canvas.height;c.fillStyle='#f8f5ed';c.fillRect(0,0,width,h);c.strokeStyle='#c8cec0';c.lineWidth=2;c.strokeRect(34,34,width-68,h-68);
 c.fillStyle='#23483e';c.font='italic 64px Georgia, serif';c.fillText('arcana.',pad,137);c.font=`500 25px ${sans}`;c.fillStyle='#798573';c.fillText(value.locale==='en'?'OUR LITTLE DATE':'我们的约会',pad,200);
 c.strokeStyle='#c8cec0';c.beginPath();c.moveTo(pad,246);c.lineTo(width-pad,246);c.stroke();
 let y=333;c.textBaseline='top';layout.forEach((r,i)=>{c.fillStyle='#23483e';c.font=`500 36px ${sans}`;const timeLines=wrap(r.time,`500 36px ${sans}`,timeWidth);timeLines.forEach((t,j)=>c.fillText(t,pad,y+j*43));
  c.strokeStyle='#c5cebb';c.lineWidth=2;c.beginPath();c.moveTo(textX-29,y+18);c.lineTo(textX-29,y+r.height-15);if(i===layout.length-1)c.moveTo(textX-29,y+18);c.stroke();c.fillStyle='#9eae8b';c.beginPath();c.arc(textX-29,y+18,6,0,Math.PI*2);c.fill();
  c.fillStyle='#23483e';c.font=`500 38px ${sans}`;r.titleLines.forEach((line,j)=>c.fillText(line,textX,y+j*52));c.fillStyle='#78806e';c.font=`28px ${sans}`;r.detailLines.forEach((line,j)=>c.fillText(line,textX,y+r.titleLines.length*52+7+j*42));y+=r.height;
 });
 y+=25;c.strokeStyle='#c8cec0';c.beginPath();c.moveTo(pad,y);c.lineTo(width-pad,y);c.stroke();c.fillStyle='#23483e';c.textAlign='center';c.font=`32px ${sans}`;c.fillText(value.date.replaceAll('-','.'),width/2,y+45);c.font=`44px ${sans}`;footer.forEach((line,j)=>c.fillText(line,width/2,y+105+j*61));c.textAlign='left';
}
export function Memento({value}:{value:Keepsake}){const ref=useRef<HTMLCanvasElement>(null),[error,setError]=useState('');useEffect(()=>{if(ref.current)try{paintKeepsake(ref.current,value);}catch{}},[value]);async function download(){const canvas=ref.current;if(!canvas)return;try{await document.fonts.ready;paintKeepsake(canvas,value);const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('图片生成失败，请重试')),'image/png'));const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`arcana-${value.date}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}catch(e){setError((e as Error).message);}}return <section className="keepsake-png"><h2>约会纪念长图</h2><canvas ref={ref} aria-label={`${value.date} ${value.city} 约会纪念长图`} role="img"/><button className="secondary" onClick={download}><Download size={17}/>保存 PNG 长图</button>{error&&<p role="alert">{error}</p>}</section>;}
