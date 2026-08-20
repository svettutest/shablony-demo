const S={tokenUrl:"/api/voice-token",label:"Позвонить",title:"Голосовой помощник",accent:"#2563eb",notice:"Сейчас включится микрофон, и вы поговорите с голосовым помощником. Разговор нужен только для ответа на ваши вопросы."},g={idle:"",connecting:"Соединяю…",live:"Говорите",ended:"Разговор завершён"};function k(i={}){const{livekit:c}=i;if(!(c!=null&&c.Room))throw new Error("mountVoiceWidget: нужен livekit-client — передай его в options.livekit");const s={...S,...i},{Room:w,RoomEvent:l,Track:b}=c;let n=null;const t=document.createElement("div");t.className="vw-root",t.style.setProperty("--vw-accent",s.accent),t.innerHTML=`
    <div class="vw-panel" hidden>
      <div class="vw-panel-head">
        <span class="vw-title"></span>
        <button class="vw-close" type="button" aria-label="Закрыть">×</button>
      </div>
      <p class="vw-notice"></p>
      <div class="vw-status"><span class="vw-dot"></span><span class="vw-status-text"></span></div>
      <div class="vw-actions">
        <button class="vw-start" type="button"></button>
        <button class="vw-stop" type="button" hidden>Завершить</button>
      </div>
      <p class="vw-error" hidden></p>
    </div>
    <button class="vw-launcher" type="button">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <path d="M2 12h2M6 8v8M10 4v16M14 7v10M18 10v4M22 12h0"/>
      </svg>
      <span class="vw-launcher-label"></span>
    </button>
  `,document.body.appendChild(t);const e={panel:t.querySelector(".vw-panel"),title:t.querySelector(".vw-title"),notice:t.querySelector(".vw-notice"),status:t.querySelector(".vw-status"),statusText:t.querySelector(".vw-status-text"),start:t.querySelector(".vw-start"),stop:t.querySelector(".vw-stop"),close:t.querySelector(".vw-close"),error:t.querySelector(".vw-error"),launcher:t.querySelector(".vw-launcher"),launcherLabel:t.querySelector(".vw-launcher-label")};e.title.textContent=s.title,e.notice.textContent=s.notice,e.start.textContent=s.label,e.launcherLabel.textContent=s.label;function a(o,v){e.statusText.textContent=g[o]||"",e.status.hidden=o==="idle",e.status.dataset.state=o,e.start.hidden=o==="connecting"||o==="live",e.stop.hidden=o!=="live"}function r(o){e.error.textContent=o,e.error.hidden=!1}async function y(){e.error.hidden=!0,a("connecting");try{const o=await fetch(s.tokenUrl,{method:"POST"});if(!o.ok){r(o.status===429?"Сейчас много звонков, попробуйте через минуту.":"Помощник временно недоступен."),a("idle");return}const{serverUrl:v,token:f}=await o.json();n=new w,n.on(l.TrackSubscribed,p=>{if(p.kind===b.Kind.Audio){const h=p.attach();h.style.display="none",t.appendChild(h)}}),n.on(l.Disconnected,()=>a("ended")),await n.connect(v,f),await n.localParticipant.setMicrophoneEnabled(!0),a("live")}catch{r("Не получилось включить микрофон. Разрешите доступ и попробуйте снова."),a("idle")}}function d(){n==null||n.disconnect(),n=null,a("ended")}const u=()=>n==null?void 0:n.disconnect();return e.launcher.addEventListener("click",()=>{e.panel.hidden=!1,e.launcher.hidden=!0,e.error.hidden=!0,a("idle")}),e.close.addEventListener("click",()=>{d(),e.panel.hidden=!0,e.launcher.hidden=!1}),e.start.addEventListener("click",y),e.stop.addEventListener("click",d),window.addEventListener("pagehide",u),a("idle"),function(){window.removeEventListener("pagehide",u),n==null||n.disconnect(),n=null,t.remove()}}function E(){const i=document.querySelector("script[data-voice-widget]");if(!i)return{};const c=i.dataset;return{tokenUrl:c.tokenUrl,label:c.label,title:c.title,accent:c.accent,notice:c.notice}}export{E as configFromScriptTag,k as mountVoiceWidget};
