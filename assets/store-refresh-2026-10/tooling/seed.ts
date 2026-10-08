import { Preferences } from '@capacitor/preferences';
import { contentData, questionData, navigationData, translations } from '/src/data/index.ts';
const p = new URLSearchParams(location.search);
const scene = p.get('scene') || 'study';
const language = p.get('lang') || 'en';
const save = async (key, state) => Preferences.set({key:'persist:'+key,value:JSON.stringify(Object.fromEntries(Object.entries({...state,_persist:{version:-1,rehydrated:true}}).map(([k,v])=>[k,JSON.stringify(v)])))});
await Preferences.clear();
await save('settings',{language,hasSavedLanguage:true,welcomeCompleted:scene!=='languages',theme:scene==='dark'?'dark':'light',displayMode:'compact',quizHomePremiumDismissed:true});
await save('notifications',{notifications:{studyInfo:{seen:true},quizInfo:{seen:true},testInfo:{seen:true}}});
await save('purchase',{owned:true,canPurchase:false,orderState:'ready',price:'',title:'',description:''});
const keys=Object.keys(contentData);
const seen={};
for(const key of keys) if(key.startsWith('nav.vehicleControls')||key.startsWith('nav.defensiveDriving')) seen[key]=true;
for(const prefix of ['nav.rulesOfTheRoad','nav.roadMarkings','nav.signs']) {
 const group=keys.filter(k=>k.startsWith(prefix)); group.slice(0,Math.ceil(group.length*.35)).forEach(k=>seen[k]=true);
}
const contentKey=keys.find(k=>k.includes('regulatory')&&k.includes('prohibition')) || keys.find(k=>k.includes('warning')) || keys.find(k=>k.startsWith('nav.signs'));
const seenLeaves={}; for(const key of Object.keys(seen)) contentData[key].forEach((_,i)=>seenLeaves[key+'.'+(i+1)]=true);
await save('study-log',{seenContentKeys:seenLeaves,lastSeenParentContentKey:contentKey});
await save('study-navigation',{currentNavigationKey:scene==='content'?contentKey:'nav'});
const all=Object.values(questionData).flat();
const caption=q=>typeof q.text==='string'?(translations[q.text]?.en||''):'';
const quizFirst=all.find(q=>q.image && !q.image2 && caption(q).length>0 && caption(q).length<110 && q.option.every(o=>(translations[o.value]?.en||'').length<100));
const quiz=[quizFirst,...all.filter(q=>q!==quizFirst).slice(0,9)].map(q=>({question:q,answer:null}));
await save('quiz-session',{questionAnswers:quiz,maxQuestions:10,experienceGained:0,completedAt:null});
const banks={A:[],B:[],C:[]};
for(const [key,qs] of Object.entries(questionData)) {
 const section=key.startsWith('nav.vehicleControls')?'A':(/^nav\.(rulesOfTheRoad|defensiveDriving|roadSignals)/.test(key)?'B':'C');
 banks[section].push(...qs);
}
const test=[];
for(const [section,count] of [['A',8],['B',28],['C',28]]) {
 const bank=banks[section];
 if(section==='C'&&quizFirst) {const i=bank.findIndex(q=>q.id===quizFirst.id);if(i>=0)bank.unshift(...bank.splice(i,1));}
 bank.slice(0,count).forEach((q,i)=>test.push({section,question:q,answer:scene==='results'?(i<(section==='A'?7:section==='B'?24:25)?q.answer:q.option.find(o=>o.id!==q.answer).id):null}));
}
await save('test-session',{questionAnswers:test,currentSection:'C',completedAt:scene==='results'?'2026-10-08T12:00:00.000Z':null});
const routes={study:'/study',dark:'/study',quiz:'/quiz/session',test:'/test/session',content:'/content',results:'/test/results',languages:'/study'};
history.replaceState(null,'',routes[scene]||'/study');
await import('/src/index.tsx');
// Wait for React paint, fonts, image decoding and finite UI entrance/count animations.
await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
await document.fonts.ready;
await Promise.all([...document.images].map(img => img.decode().catch(()=>{})));
await new Promise(resolve => setTimeout(resolve, 1400));
window.parent.document.body.dataset.captureReady='true';
