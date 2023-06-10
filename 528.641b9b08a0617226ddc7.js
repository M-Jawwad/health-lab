"use strict";(self.webpackChunkprism_health_lab=self.webpackChunkprism_health_lab||[]).push([[528],{6528:(St,y,r)=>{r.r(y),r.d(y,{PlatformModule:()=>yt});var h=r(8583),N=r(665),f=r(1841),P=r(5566),d=r(3633),g=r(4330),e=r(7716),S=r(5319),U=r(2759),V=r(6682),F=r(5435),H=r(7393),J=r(3637);const b={leading:!0,trailing:!1};class B{constructor(n,t,s,o){this.duration=n,this.scheduler=t,this.leading=s,this.trailing=o}call(n,t){return t.subscribe(new Q(n,this.duration,this.scheduler,this.leading,this.trailing))}}class Q extends H.L{constructor(n,t,s,o,a){super(n),this.duration=t,this.scheduler=s,this.leading=o,this.trailing=a,this._hasTrailingValue=!1,this._trailingValue=null}_next(n){this.throttled?this.trailing&&(this._trailingValue=n,this._hasTrailingValue=!0):(this.add(this.throttled=this.scheduler.schedule(K,this.duration,{subscriber:this})),this.leading?this.destination.next(n):this.trailing&&(this._trailingValue=n,this._hasTrailingValue=!0))}_complete(){this._hasTrailingValue?(this.destination.next(this._trailingValue),this.destination.complete()):this.destination.complete()}clearThrottle(){const n=this.throttled;n&&(this.trailing&&this._hasTrailingValue&&(this.destination.next(this._trailingValue),this._trailingValue=null,this._hasTrailingValue=!1),n.unsubscribe(),this.remove(n),this.throttled=null)}}function K(i){const{subscriber:n}=i;n.clearThrottle()}class m{constructor(){this.idValue=new Date,this.idlingValue=!1}id(n){if(void 0!==n){if(!n)throw new Error("A value must be specified for the ID.");this.idValue=n}return this.idValue}idling(n){return void 0!==n&&(this.idlingValue=n),this.idlingValue}now(){return new Date}isExpired(){const n=this.last();return null!=n&&n<=this.now()}}class G{constructor(n,t){this.source=n,n.initialize&&n.initialize(t)}subscribe(n){this.sub=this.source.onInterrupt.subscribe(n)}unsubscribe(){this.sub.unsubscribe(),this.sub=null}resume(){this.source.attach()}pause(){this.source.detach()}}class v{}class ${constructor(){this.storageMap={}}get length(){return Object.keys(this.storageMap).length}clear(){this.storageMap={}}getItem(n){return void 0!==this.storageMap[n]?this.storageMap[n]:null}key(n){return Object.keys(this.storageMap)[n]||null}removeItem(n){this.storageMap[n]=void 0}setItem(n,t){this.storageMap[n]=t}}let T=(()=>{class i{constructor(){this.storage=this.getStorage()}getStorage(){try{const t=localStorage;return t.setItem("ng2IdleStorage",""),t.removeItem("ng2IdleStorage"),t}catch(t){return new $}}getItem(t){return this.storage.getItem("ng2Idle."+t)}removeItem(t){this.storage.removeItem("ng2Idle."+t)}setItem(t,s){this.storage.setItem("ng2Idle."+t,s)}_wrapped(){return this.storage}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275prov=e.Yz7({token:i,factory:i.\u0275fac}),i})(),x=(()=>{class i extends m{constructor(t){super(),this.localStorage=t,this.idleName="main"}last(t){return void 0!==t&&this.setExpiry(t),this.getExpiry()}idling(t){return void 0!==t&&this.setIdling(t),this.getIdling()}getIdleName(){return this.idleName}setIdleName(t){t&&(this.idleName=t)}getExpiry(){const t=this.localStorage.getItem(this.idleName+".expiry");return t?new Date(parseInt(t,10)):null}setExpiry(t){t?this.localStorage.setItem(this.idleName+".expiry",t.getTime().toString()):this.localStorage.removeItem(this.idleName+".expiry")}getIdling(){const t=this.localStorage.getItem(this.idleName+".idling");return!!t&&"true"===t}setIdling(t){this.localStorage.setItem(this.idleName+".idling",t?t.toString():"false")}}return i.\u0275fac=function(t){return new(t||i)(e.LFG(T))},i.\u0275prov=e.Yz7({token:i,factory:i.\u0275fac}),i})();var c=(()=>{return(i=c||(c={}))[i.disabled=0]="disabled",i[i.idle=1]="idle",i[i.notIdle=2]="notIdle",c;var i})();let M=(()=>{class i{constructor(t,s,o,a){this.expiry=t,this.zone=s,this.platformId=a,this.idle=1200,this.timeoutVal=30,this.autoResume=c.idle,this.interrupts=new Array,this.running=!1,this.keepaliveEnabled=!1,this.onIdleStart=new e.vpe,this.onIdleEnd=new e.vpe,this.onTimeoutWarning=new e.vpe,this.onTimeout=new e.vpe,this.onInterrupt=new e.vpe,o&&(this.keepaliveSvc=o,this.keepaliveEnabled=!0),this.setIdling(!1)}setIdleName(t){if(!(this.expiry instanceof x))throw new Error("Cannot set expiry key name because no LocalStorageExpiry has been provided.");this.expiry.setIdleName(t)}getKeepaliveEnabled(){return this.keepaliveEnabled}setKeepaliveEnabled(t){if(!this.keepaliveSvc)throw new Error("Cannot enable keepalive integration because no KeepaliveSvc has been provided.");return this.keepaliveEnabled=t}getTimeout(){return this.timeoutVal}setTimeout(t){if(!1===t)this.timeoutVal=0;else{if(!("number"==typeof t&&t>=0))throw new Error("'seconds' can only be 'false' or a positive number.");this.timeoutVal=t}return this.timeoutVal}getIdle(){return this.idle}setIdle(t){if(t<=0)throw new Error("'seconds' must be greater zero");return this.idle=t}getAutoResume(){return this.autoResume}setAutoResume(t){return this.autoResume=t}setInterrupts(t){this.clearInterrupts();const s=this;for(const o of t){const l=new G(o,{platformId:this.platformId});l.subscribe(E=>{s.interrupt(E.force,E.innerArgs)}),this.interrupts.push(l)}return this.interrupts}getInterrupts(){return this.interrupts}clearInterrupts(){for(const t of this.interrupts)t.pause(),t.unsubscribe();this.interrupts.length=0}isRunning(){return this.running}isIdling(){return this.idling}watch(t){this.safeClearInterval("idleHandle"),this.safeClearInterval("timeoutHandle");const s=this.timeoutVal?this.timeoutVal:0;if(!t){const a=new Date(this.expiry.now().getTime()+1e3*(this.idle+s));this.expiry.last(a)}this.idling&&this.toggleState(),this.running||(this.startKeepalive(),this.toggleInterrupts(!0)),this.running=!0;const o=()=>{this.zone.run(()=>{const a=this.getExpiryDiff(s);a>0?(this.safeClearInterval("idleHandle"),this.setIdleIntervalOutsideOfZone(o,a)):this.toggleState()})};this.setIdleIntervalOutsideOfZone(o,1e3*this.idle)}setIdleIntervalOutsideOfZone(t,s){this.zone.runOutsideAngular(()=>{this.idleHandle=setInterval(t,s)})}stop(){this.stopKeepalive(),this.toggleInterrupts(!1),this.safeClearInterval("idleHandle"),this.safeClearInterval("timeoutHandle"),this.setIdling(!1),this.running=!1,this.expiry.last(null)}timeout(){this.stopKeepalive(),this.toggleInterrupts(!1),this.safeClearInterval("idleHandle"),this.safeClearInterval("timeoutHandle"),this.setIdling(!0),this.running=!1,this.countdown=0,this.onTimeout.emit(null)}interrupt(t,s){if(this.running){if(this.timeoutVal&&this.expiry.isExpired())return void this.timeout();this.onInterrupt.emit(s),(!0===t||this.autoResume===c.idle||this.autoResume===c.notIdle&&!this.expiry.idling())&&this.watch(t)}}setIdling(t){this.idling=t,this.expiry.idling(t)}toggleState(){this.setIdling(!this.idling),this.idling?(this.onIdleStart.emit(null),this.stopKeepalive(),this.timeoutVal>0&&(this.countdown=this.timeoutVal,this.doCountdown(),this.setTimoutIntervalOutsideZone(()=>{this.doCountdownInZone()},1e3))):(this.toggleInterrupts(!0),this.onIdleEnd.emit(null),this.startKeepalive()),this.safeClearInterval("idleHandle")}setTimoutIntervalOutsideZone(t,s){this.zone.runOutsideAngular(()=>{this.timeoutHandle=setInterval(()=>{t()},s)})}toggleInterrupts(t){for(const s of this.interrupts)t?s.resume():s.pause()}getExpiryDiff(t){const s=this.expiry.now();return(this.expiry.last()||s).getTime()-s.getTime()-1e3*t}doCountdownInZone(){this.zone.run(()=>{this.doCountdown()})}doCountdown(){if(this.getExpiryDiff(this.timeoutVal)>0)return this.safeClearInterval("timeoutHandle"),void this.interrupt(!0);if(this.idling){if(this.countdown<=0)return void this.timeout();this.onTimeoutWarning.emit(this.countdown),this.countdown--}}safeClearInterval(t){null!=this[t]&&(clearInterval(this[t]),this[t]=null)}startKeepalive(){!this.keepaliveSvc||!this.keepaliveEnabled||(this.running&&this.keepaliveSvc.ping(),this.keepaliveSvc.start())}stopKeepalive(){!this.keepaliveSvc||!this.keepaliveEnabled||this.keepaliveSvc.stop()}ngOnDestroy(){this.stop(),this.clearInterrupts()}}return i.\u0275fac=function(t){return new(t||i)(e.LFG(m),e.LFG(e.R0b),e.LFG(v,8),e.LFG(e.Lbi,8))},i.\u0275prov=e.Yz7({token:i,factory:i.\u0275fac}),i})();class W{constructor(n,t,s=!1){this.source=n,this.innerArgs=t,this.force=s}}class Z extends class{constructor(n,t){this.attachFn=n,this.detachFn=t,this.isAttached=!1,this.onInterrupt=new e.vpe}attach(){!0!==Zone.current.get("isAngularZone")?(!this.isAttached&&this.attachFn&&this.attachFn(this),this.isAttached=!0):Zone.current.parent.run(()=>this.attach())}detach(){this.isAttached&&this.detachFn&&this.detachFn(this),this.isAttached=!1}}{constructor(n,t,s){super(null,null),this.target=n,this.events=t,this.opts=s,this.eventSubscription=new S.w,"number"==typeof this.opts&&(this.opts={throttleDelay:this.opts,passive:!1}),this.opts=this.opts||{passive:!1,throttleDelay:500},null==this.opts.throttleDelay&&(this.opts.throttleDelay=500),this.throttleDelay=this.opts.throttleDelay,this.passive=!!this.opts.passive}initialize(n){if((null==n?void 0:n.platformId)&&(0,h.PM)(n.platformId))return;const t="function"==typeof this.target?this.target():this.target,s=this.passive?{passive:!0}:null,o=this.events.split(" ").map(l=>(0,U.R)(t,l,s));this.eventSrc=(0,V.T)(...o),this.eventSrc=this.eventSrc.pipe((0,F.h)(l=>!this.filterEvent(l))),this.throttleDelay>0&&(this.eventSrc=this.eventSrc.pipe(function(i,n=J.P,t=b){return s=>s.lift(new B(i,n,t.leading,t.trailing))}(this.throttleDelay)));const a=l=>this.onInterrupt.emit(new W(this,l));this.attachFn=()=>this.eventSubscription=this.eventSrc.subscribe(a),this.detachFn=()=>this.eventSubscription.unsubscribe()}filterEvent(n){return!1}get options(){return{passive:this.passive,throttleDelay:this.throttleDelay}}}class k extends Z{constructor(n,t){super(()=>window,n,t)}}let _=(()=>{class i{static forRoot(){return{ngModule:i,providers:[x,{provide:m,useExisting:x},M]}}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({providers:[T]}),i})();const et=[new class extends Z{constructor(n,t){super(()=>document.documentElement,n,t)}filterEvent(n){return!("mousemove"!==n.type||!(n.originalEvent&&0===n.originalEvent.movementX&&0===n.originalEvent.movementY||void 0!==n.movementX&&!n.movementX)&&n.movementY)}}("mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll",i),new class extends k{constructor(n=500){super("storage",n)}filterEvent(n){return!(n.key&&n.key.indexOf("ng2Idle.")>=0&&n.key.indexOf(".expiry")>=0)}}(i)];var i;let I=(()=>{class i extends v{constructor(t,s){super(),this.http=t,this.zone=s,this.pingInterval=600,this.onPing=new e.vpe,this.onPingResponse=new e.vpe}request(t){return"string"==typeof t?this.pingRequest=new f.aW("GET",t):t instanceof f.aW?this.pingRequest=t:null===t&&(this.pingRequest=null),this.pingRequest}interval(t){if(!isNaN(t)&&t>0)this.pingInterval=t;else if(!isNaN(t)&&t<=0)throw new Error("Interval value must be greater than zero.");return this.pingInterval}ping(){this.onPing.emit(null),this.pingRequest&&this.http.request(this.pingRequest).subscribe(t=>{this.onPingResponse.emit(t)},t=>{this.onPingResponse.emit(t)})}start(){this.stop(),this.zone.runOutsideAngular(()=>{this.pingHandle=setInterval(()=>{this.zone.run(()=>{this.ping()})},1e3*this.pingInterval)})}stop(){this.hasPingHandle()&&(clearInterval(this.pingHandle),this.pingHandle=null)}ngOnDestroy(){this.stop()}isRunning(){return this.hasPingHandle()}hasPingHandle(){return null!=this.pingHandle}}return i.\u0275fac=function(t){return new(t||i)(e.LFG(f.eN),e.LFG(e.R0b))},i.\u0275prov=e.Yz7({token:i,factory:i.\u0275fac}),i})(),it=(()=>{class i{static forRoot(){return{ngModule:i,providers:[I,{provide:v,useExisting:I}]}}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[[_.forRoot()]]}),i})(),nt=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[[h.ez,N.u5,g.Bz,f.JF,d.IJ,P.o9,it.forRoot()]]}),i})();var p=r(2340),C=r(5830),A=r(9344),u=r(1819),O=r(8030);function st(i,n){1&i&&(e.TgZ(0,"div",16),e.TgZ(1,"span",17),e._UZ(2,"img",18),e._UZ(3,"img",19),e.qZA(),e.qZA())}function rt(i,n){1&i&&(e.TgZ(0,"div",20),e._UZ(1,"img",21),e.qZA())}function ot(i,n){if(1&i&&(e.TgZ(0,"span"),e._uU(1,"Signed in as "),e.TgZ(2,"b"),e._uU(3),e.qZA(),e.qZA()),2&i){const t=e.oxw();e.xp6(3),e.Oqu(null==t.acUser?null:t.acUser.name)}}function at(i,n){1&i&&(e.TgZ(0,"span"),e._uU(1,"Signed in as "),e.TgZ(2,"b"),e._uU(3,"COB Admin"),e.qZA(),e.qZA())}let lt=(()=>{class i{constructor(t,s,o,a,l){this.apiService=t,this.toastrService=s,this.router=o,this.idle=a,this.keepalive=l,this.idleState="Not Started",this.userSubscription$=new S.w,this.toggleMenu=!0,this.signal=new e.vpe,this.acUser=null,this.timedOut=!1,this.sessionTimeOut=60}ngOnInit(){var t;this.signal.emit(this.toggleMenu),this.getCurrentUser(),this.getLoginSettings(),this.userSubscription$=null===(t=null==localStorage?void 0:localStorage.changes)||void 0===t?void 0:t.subscribe(s=>{var o=localStorage.getItem("user");(o=JSON.parse(o))&&(this.acUser=o)})}getLoginSettings(){this.apiService.get(`${p.N.userms}/setting/user-session-setting/?id=1`).subscribe(s=>{this.sessionTimeOut=+s.data.data.session_time,this.monitorUserIdling()},s=>{this.toastrService.error(s.error.message,"Error getting login settings",{progressAnimation:"decreasing",progressBar:!0,timeOut:3e3})})}getCurrentUser(){this.apiService.get(`${p.N.userms}/users/get-current-user`).subscribe(s=>{this.acUser=s.data.data,localStorage.setItem("user",JSON.stringify(this.acUser))},s=>{[401,2,3,11,151,153,18,300,301].includes(s.error.status)?this.toastrService.error(s.error.message,"Access Unauthorized",{progressBar:!0,progressAnimation:"decreasing",timeOut:3e3}):this.toastrService.error(s.error.message,"Error getting user information",{progressAnimation:"decreasing",progressBar:!0,timeOut:3e3})})}getPaginationSettings(){this.apiService.get(`${p.N.userms}/setting/pagination-setting/?id=1`).subscribe(s=>{localStorage.setItem("limit",s.data.data.item_per_page)},s=>{this.toastrService.error(s.error.message,"Error getting pagination settings",{progressAnimation:"decreasing",progressBar:!0,timeOut:3e3})})}onToggleMenu(){this.toggleMenu=!this.toggleMenu,this.signal.emit(this.toggleMenu)}onLogout(){this.apiService.post(`${p.N.userms}/users/logout`,{}).subscribe(s=>{window.location.href="",localStorage.removeItem("token"),localStorage.removeItem("menu"),localStorage.removeItem("user"),localStorage.removeItem("limit")},s=>{this.toastrService.error(s.error.message,"Error",{progressAnimation:"decreasing",progressBar:!0,timeOut:3e3})})}navigateToProfile(){this.router.navigateByUrl("admin/users/user-profile")}monitorUserIdling(){this.idle.setIdle(this.sessionTimeOut),this.idle.setTimeout(5),this.idle.setInterrupts(et),this.idle.onIdleStart.subscribe(()=>{this.idleState="You've gone idle!"}),this.idle.onIdleEnd.subscribe(()=>{this.idleState="No longer idle.",this.reset()}),this.idle.onTimeoutWarning.subscribe(t=>{this.idleState="You will time out in "+t+" seconds!"}),this.idle.onTimeout.subscribe(()=>{this.idleState="Timed out!",this.timedOut=!0,this.onLogout()}),this.keepalive.interval(5),this.keepalive.onPing.subscribe(()=>{this.lastPing=new Date}),this.reset()}reset(){this.idle.watch(),this.idleState="Started.",this.timedOut=!1,this.lastPing=void 0}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(C.s),e.Y36(A._W),e.Y36(g.F0),e.Y36(M),e.Y36(I))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-header"]],outputs:{signal:"signal"},decls:21,vars:5,consts:[[1,"site-navbar","navbar","navbar-default","h-66","p-0"],["fxLayout","row","fxLayoutAlign","space-between center","fxLayoutGap","8px",1,"w-100-p","h-100-p","white"],["fxLayout","row","fxLayoutAlign","start center","fxLayoutGap","8px",1,"h-100-p"],["style","max-width: 220px;","fxLayout","row","fxHide.lt-md","",4,"ngIf"],["fxHide.lt-md","","class","w-72 pt-10",4,"ngIf"],["fxLayout","row","fxLayoutAlign","center center","accesskey","b",1,"h-100-p","w-50","mr-0","sign-in",3,"click"],[1,"ri-menu-line","fs-24"],["fxLayout","row","fxLayoutAlign","end center",1,"h-100-p"],["fxLayout","row","fxLayoutAlign","center center",1,"sign-in","h-100-p","p-12"],[4,"ngIf"],["ngbDropdown","",1,"d-inline-block","h-100-p","pt-10","sign-in"],["id","dropdownBasic1","ngbDropdownToggle","",1,"btn",2,"box-shadow","none"],[1,"avatar","avatar-online"],["alt","...",2,"height","30px !important","width","30px !important",3,"src"],["ngbDropdownMenu","","aria-labelledby","dropdownBasic1"],["ngbDropdownItem","",3,"click"],["fxLayout","row","fxHide.lt-md","",2,"max-width","220px"],["fxLayout","row",1,"navbar-brand-text","mt-10","ml-0"],["src","assets/images/logo-vodafone-white-icon1.png","alt","",1,"navbar-brand-logo","pr-8","h-42"],["src","assets/images/logo-vodafone-white-text1.png","alt","",1,"navbar-brand-logo","pr-20","h-42"],["fxHide.lt-md","",1,"w-72","pt-10"],["src","assets/images/logo-vodafone-white-icon1.png","alt","",1,"navbar-brand-logo","pr-16","h-42"]],template:function(t,s){1&t&&(e.TgZ(0,"nav",0),e.TgZ(1,"div",1),e.TgZ(2,"div",2),e.YNc(3,st,4,0,"div",3),e.YNc(4,rt,2,0,"div",4),e.TgZ(5,"div",5),e.NdJ("click",function(){return s.onToggleMenu()}),e._UZ(6,"i",6),e.qZA(),e.qZA(),e.TgZ(7,"div",7),e.TgZ(8,"div",8),e.YNc(9,ot,4,1,"span",9),e.YNc(10,at,4,0,"span",9),e.qZA(),e.TgZ(11,"div",10),e.TgZ(12,"button",11),e.TgZ(13,"span",12),e._UZ(14,"img",13),e._UZ(15,"i"),e.qZA(),e.qZA(),e.TgZ(16,"div",14),e.TgZ(17,"button",15),e.NdJ("click",function(){return s.navigateToProfile()}),e._uU(18,"Profile Setting"),e.qZA(),e.TgZ(19,"button",15),e.NdJ("click",function(){return s.onLogout()}),e._uU(20,"Logout"),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA(),e.qZA()),2&t&&(e.xp6(3),e.Q6J("ngIf",s.toggleMenu),e.xp6(1),e.Q6J("ngIf",!s.toggleMenu),e.xp6(5),e.Q6J("ngIf",s.acUser),e.xp6(1),e.Q6J("ngIf",!s.acUser),e.xp6(4),e.Q6J("src",null!=s.acUser&&s.acUser.user_picture?s.acUser.user_picture:"./assets/images/default_user.png",e.LSH))},directives:[d.M2,u.xw,u.Wh,u.SQ,h.O5,d.jt,d.iD,d.Vi,d.TH,O.b8],styles:[".sign-in[_ngcontent-%COMP%]:hover{background-color:#0000001a}  .dropdown-toggle:after{display:none}.dropdown-menu[_ngcontent-%COMP%]{left:-104px;padding:8px 4px;border-radius:4px}"]}),i})();const D=function(i){return[i]},L=function(){return{exact:!0}};function ut(i,n){if(1&i&&(e.ynx(0),e.TgZ(1,"div",3),e.TgZ(2,"a",4),e._UZ(3,"i",5),e.TgZ(4,"span"),e._uU(5),e.qZA(),e.qZA(),e.qZA(),e.BQk()),2&i){const t=e.oxw().$implicit;e.xp6(2),e.Q6J("routerLink",e.VKq(4,D,t.route))("routerLinkActiveOptions",e.DdM(6,L)),e.xp6(1),e.s9C("ngClass",null==t?null:t.icon),e.xp6(2),e.Oqu(t.name)}}function ht(i,n){1&i&&e._UZ(0,"i",11)}function dt(i,n){1&i&&e._UZ(0,"i",12)}function gt(i,n){if(1&i&&(e.TgZ(0,"div",3),e.TgZ(1,"a",4),e._UZ(2,"i",14),e.TgZ(3,"span"),e._uU(4),e.qZA(),e.qZA(),e.qZA()),2&i){const t=e.oxw().$implicit;e.xp6(1),e.Q6J("routerLink",e.VKq(3,D,t.route))("routerLinkActiveOptions",e.DdM(5,L)),e.xp6(3),e.Oqu(t.name)}}function ct(i,n){if(1&i&&(e.ynx(0),e.YNc(1,gt,5,6,"div",13),e.BQk()),2&i){const t=e.oxw(2).index,s=e.oxw();e.xp6(1),e.Q6J("ngIf",s.menus[t].expanded)}}function pt(i,n){if(1&i){const t=e.EpF();e.ynx(0),e.TgZ(1,"div",6),e.NdJ("click",function(){e.CHM(t);const o=e.oxw().index,a=e.oxw();return a.onSelectedItem(a.menus,o)}),e.TgZ(2,"a",7),e.TgZ(3,"div",8),e._UZ(4,"i",5),e.TgZ(5,"span"),e._uU(6),e.qZA(),e.qZA(),e.YNc(7,ht,1,0,"i",9),e.YNc(8,dt,1,0,"i",10),e.qZA(),e.qZA(),e.YNc(9,ct,2,1,"ng-container",1),e.BQk()}if(2&i){const t=e.oxw().$implicit;e.xp6(4),e.s9C("ngClass",null==t?null:t.icon),e.xp6(2),e.Oqu(t.name),e.xp6(1),e.Q6J("ngIf",!t.expanded),e.xp6(1),e.Q6J("ngIf",t.expanded),e.xp6(1),e.Q6J("ngForOf",t.sub_menu)}}function ft(i,n){if(1&i&&(e.ynx(0),e.YNc(1,ut,6,7,"ng-container",2),e.YNc(2,pt,10,5,"ng-container",2),e.BQk()),2&i){const t=n.$implicit;e.xp6(1),e.Q6J("ngIf",!t.is_parent),e.xp6(1),e.Q6J("ngIf",t.is_parent)}}let mt=(()=>{class i{constructor(t,s){this.apiService=t,this.toastrService=s,this.isCollapsed=!1,this.menus=[]}ngOnInit(){setTimeout(()=>{let t=localStorage.getItem("menu");this.menus=JSON.parse(t)},100)}getMenu(){return this.apiService.get(`${p.N.userms}/users/menu-preferences`).subscribe(s=>{this.menus=s.data,localStorage.setItem("menu",JSON.stringify(this.menus))},s=>{this.toastrService.error(s.error.message,"Error",{progressAnimation:"decreasing",progressBar:!0,timeOut:3e3})})}onSelectedItem(t,s){t[s].expanded=!t[s].expanded;for(let o=0;o<t.length;o++)t[s].expanded?(t[o].expanded=!1,t[s].expanded=!0):t[s].expanded=!1}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(C.s),e.Y36(A._W))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-sidebar"]],decls:2,vars:1,consts:[["fxLayout","row wrap",1,"w-100-p"],[4,"ngFor","ngForOf"],[4,"ngIf"],[1,"w-100-p","site-menu-item"],["fxFlex","100","fxLayout","row","fxLayoutGap","8px","fxLayoutAlign","start center","routerLinkActive","active",1,"h-38","w-100-p",2,"list-style","none",3,"routerLink","routerLinkActiveOptions"],[1,"site-menu-icon","fs-18","fw-400",3,"ngClass"],["fxLayoutAlign","space-between center",1,"w-100-p","site-menu-item",3,"click"],["fxFlex","100","fxLayout","row","fxLayoutGap","8px","fxLayoutAlign","space-between center",1,"h-38","w-100-p",2,"list-style","none"],["fxLayoutGap","8px","fxLayoutAlign","start center",1,"lh-18"],["class","ri-add-line fw-400",4,"ngIf"],["class","ri-subtract-line fw-400",4,"ngIf"],[1,"ri-add-line","fw-400"],[1,"ri-subtract-line","fw-400"],["class","w-100-p site-menu-item",4,"ngIf"],[1,"site-menu-icon","fs-18","fw-400"]],template:function(t,s){1&t&&(e.TgZ(0,"div",0),e.YNc(1,ft,3,2,"ng-container",1),e.qZA()),2&t&&(e.xp6(1),e.Q6J("ngForOf",s.menus))},directives:[u.xw,h.sg,h.O5,g.yS,u.yH,u.SQ,u.Wh,g.Od,h.mk,O.oO],styles:['[_nghost-%COMP%]{font-size:14px;font-weight:600;font-family:"Vodafone Lt";background:#fff}.site-menu-item[_ngcontent-%COMP%]{padding:0;border-top:1px solid #f9f9f9;cursor:pointer}.site-menu-item[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:hover{background-color:#e9ecef}.active[_ngcontent-%COMP%]{background-color:#e9ecef}a[_ngcontent-%COMP%]{color:#444!important;line-height:36px;text-decoration:none;padding:0 16px}.site-menu-icon[_ngcontent-%COMP%]{color:#e60000}']}),i})();function vt(i,n){1&i&&e._UZ(0,"app-sidebar",4)}const xt=[{path:"",component:(()=>{class i{constructor(){this.toggleMenu=!0}ngOnInit(){}onToggleMenu(t){this.toggleMenu=t}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-main-dashboard"]],decls:5,vars:1,consts:[[1,"h-66","w-100-p",3,"signal"],["fxLayout","row","fxFlex","100","autoscroll","false",2,"height","calc(100% - 66px)"],["class","sidebar","style","padding-right: 3px; overflow: auto;",4,"ngIf"],[1,"p-8",2,"flex","1","background","#f8f8f8","overflow","auto"],[1,"sidebar",2,"padding-right","3px","overflow","auto"]],template:function(t,s){1&t&&(e.TgZ(0,"app-header",0),e.NdJ("signal",function(a){return s.onToggleMenu(a)}),e.qZA(),e.TgZ(1,"div",1),e.YNc(2,vt,1,0,"app-sidebar",2),e.TgZ(3,"div",3),e._UZ(4,"router-outlet"),e.qZA(),e.qZA()),2&t&&(e.xp6(2),e.Q6J("ngIf",s.toggleMenu))},directives:[lt,u.xw,u.yH,h.O5,g.lC,mt],styles:["[_nghost-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;width:100%;height:100%;align-content:flex-start;align-items:flex-start}app-sidebar[_ngcontent-%COMP%]{border-right:1px solid #ccc;max-width:220px;width:100%}"]}),i})(),children:[{path:"",redirectTo:"dashboard"},{path:"dashboard",loadChildren:()=>Promise.all([r.e(592),r.e(264)]).then(r.bind(r,9264)).then(i=>i.DashboardModule)},{path:"users",loadChildren:()=>Promise.all([r.e(370),r.e(308),r.e(787),r.e(278),r.e(582)]).then(r.bind(r,3582)).then(i=>i.UsersModule)},{path:"customers",loadChildren:()=>Promise.all([r.e(370),r.e(308),r.e(781)]).then(r.bind(r,3781)).then(i=>i.CustomerModule)},{path:"consumer",loadChildren:()=>Promise.all([r.e(370),r.e(308),r.e(781),r.e(931),r.e(924)]).then(r.bind(r,924)).then(i=>i.ConsumerModule)},{path:"group",loadChildren:()=>Promise.all([r.e(370),r.e(308),r.e(787)]).then(r.bind(r,1787)).then(i=>i.UserGroupsModule)},{path:"setting",loadChildren:()=>Promise.all([r.e(370),r.e(430)]).then(r.bind(r,8430)).then(i=>i.SettingsModule)},{path:"packages",loadChildren:()=>Promise.all([r.e(370),r.e(308),r.e(151)]).then(r.bind(r,7151)).then(i=>i.PackagesModule)},{path:"inventory",loadChildren:()=>Promise.all([r.e(370),r.e(308),r.e(781),r.e(931),r.e(592),r.e(193)]).then(r.bind(r,8193)).then(i=>i.InventoryModule)}]},{path:"**",redirectTo:""}];let It=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[[g.Bz.forChild(xt)]]}),i})(),yt=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[[h.ez,It,nt]]}),i})()}}]);