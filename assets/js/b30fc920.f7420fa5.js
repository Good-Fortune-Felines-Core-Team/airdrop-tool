"use strict";(self.webpackChunk_jumpdefi_airdrop_tool=self.webpackChunk_jumpdefi_airdrop_tool||[]).push([[318],{6303:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>E,contentTitle:()=>A,default:()=>T,frontMatter:()=>H,metadata:()=>w,toc:()=>O});var a=t(4848),r=t(8453),i=t(6540),l=t(4164),o=t(3104),u=t(6347),s=t(205),c=t(7485),d=t(1682),m=t(9466);function f(e){var n,t;return null!=(n=null==(t=i.Children.toArray(e).filter((function(e){return"\n"!==e})).map((function(e){if(!e||(0,i.isValidElement)(e)&&((n=e.props)&&"object"==typeof n&&"value"in n))return e;var n;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})))?void 0:t.filter(Boolean))?n:[]}function v(e){var n=e.values,t=e.children;return(0,i.useMemo)((function(){var e=null!=n?n:function(e){return f(e).map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes,default:n.default}}))}(t);return function(e){var n=(0,d.X)(e,(function(e,n){return e.value===n.value}));if(n.length>0)throw new Error('Docusaurus error: Duplicate values "'+n.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.')}(e),e}),[n,t])}function p(e){var n=e.value;return e.tabValues.some((function(e){return e.value===n}))}function h(e){var n=e.queryString,t=void 0!==n&&n,a=e.groupId,r=(0,u.W6)(),l=function(e){var n=e.queryString,t=void 0!==n&&n,a=e.groupId;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return null!=a?a:null}({queryString:t,groupId:a});return[(0,c.aZ)(l),(0,i.useCallback)((function(e){if(l){var n=new URLSearchParams(r.location.search);n.set(l,e),r.replace(Object.assign({},r.location,{search:n.toString()}))}}),[l,r])]}function g(e){var n,t,a,r,l=e.defaultValue,o=e.queryString,u=void 0!==o&&o,c=e.groupId,d=v(e),f=(0,i.useState)((function(){return function(e){var n,t=e.defaultValue,a=e.tabValues;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:a}))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+t+'" but none of its children has the corresponding value. Available values are: '+a.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");return t}var r=null!=(n=a.find((function(e){return e.default})))?n:a[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:l,tabValues:d})})),g=f[0],b=f[1],x=h({queryString:u,groupId:c}),j=x[0],y=x[1],L=(n=function(e){return e?"docusaurus.tab."+e:null}({groupId:c}.groupId),t=(0,m.Dv)(n),a=t[0],r=t[1],[a,(0,i.useCallback)((function(e){n&&r.set(e)}),[n,r])]),N=L[0],C=L[1],I=function(){var e=null!=j?j:N;return p({value:e,tabValues:d})?e:null}();return(0,s.A)((function(){I&&b(I)}),[I]),{selectedValue:g,selectValue:(0,i.useCallback)((function(e){if(!p({value:e,tabValues:d}))throw new Error("Can't select invalid tab value="+e);b(e),y(e),C(e)}),[y,C,d]),tabValues:d}}var b=t(2303);const x={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function j(e){var n=e.className,t=e.block,r=e.selectedValue,i=e.selectValue,u=e.tabValues,s=[],c=(0,o.a_)().blockElementScrollPositionUntilNextRender,d=function(e){var n=e.currentTarget,t=s.indexOf(n),a=u[t].value;a!==r&&(c(n),i(a))},m=function(e){var n,t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":var a,r=s.indexOf(e.currentTarget)+1;t=null!=(a=s[r])?a:s[0];break;case"ArrowLeft":var i,l=s.indexOf(e.currentTarget)-1;t=null!=(i=s[l])?i:s[s.length-1]}null==(n=t)||n.focus()};return(0,a.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.A)("tabs",{"tabs--block":t},n),children:u.map((function(e){var n=e.value,t=e.label,i=e.attributes;return(0,a.jsx)("li",Object.assign({role:"tab",tabIndex:r===n?0:-1,"aria-selected":r===n,ref:function(e){return s.push(e)},onKeyDown:m,onClick:d},i,{className:(0,l.A)("tabs__item",x.tabItem,null==i?void 0:i.className,{"tabs__item--active":r===n}),children:null!=t?t:n}),n)}))})}function y(e){var n=e.lazy,t=e.children,r=e.selectedValue,l=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){var o=l.find((function(e){return e.props.value===r}));return o?(0,i.cloneElement)(o,{className:"margin-top--md"}):null}return(0,a.jsx)("div",{className:"margin-top--md",children:l.map((function(e,n){return(0,i.cloneElement)(e,{key:n,hidden:e.props.value!==r})}))})}function L(e){var n=g(e);return(0,a.jsxs)("div",{className:(0,l.A)("tabs-container",x.tabList),children:[(0,a.jsx)(j,Object.assign({},e,n)),(0,a.jsx)(y,Object.assign({},e,n))]})}function N(e){var n=(0,b.A)();return(0,a.jsx)(L,Object.assign({},e,{children:f(e.children)}),String(n))}const C={tabItem:"tabItem_Ymn6"};function I(e){var n=e.children,t=e.hidden,r=e.className;return(0,a.jsx)("div",{role:"tabpanel",className:(0,l.A)(C.tabItem,r),hidden:t,children:n})}var k=t(4252);const H={},A="Getting Started",w={id:"usage/getting-started",title:"Getting Started",description:"<TOCInline",source:"@site/docs/usage/getting-started.mdx",sourceDirName:"usage",slug:"/usage/getting-started",permalink:"/airdrop-tool/usage/getting-started",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Usage",permalink:"/airdrop-tool/usage/"},next:{title:"API Reference",permalink:"/airdrop-tool/api-reference/"}},E={},O=[{value:"Installation",id:"installation",level:2},{value:"Running from command line",id:"running-from-command-line",level:2}];function _(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.h1,{id:"getting-started",children:"Getting Started"}),"\n",(0,a.jsx)(k.A,{maxHeadingLevel:4,toc:O}),"\n",(0,a.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,a.jsx)(n.p,{children:"Use your favourite package manager to install the CLI:"}),"\n",(0,a.jsxs)(N,{groupId:"npm2yarn",children:[(0,a.jsx)(I,{value:"npm",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"npm install -g @jumpdefi/airdrop-tool\n"})})}),(0,a.jsx)(I,{value:"yarn",label:"Yarn",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"yarn global add @jumpdefi/airdrop-tool\n"})})}),(0,a.jsx)(I,{value:"pnpm",label:"pnpm",children:(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:"pnpm add -g @jumpdefi/airdrop-tool\n"})})})]}),"\n",(0,a.jsx)(n.admonition,{type:"note",children:(0,a.jsxs)(n.p,{children:["Although optional, it is highly recommended to install the ",(0,a.jsx)(n.a,{href:"https://docs.near.org/tools/near-cli",children:"Near CLI"})," and makes sure the account you specify in the ",(0,a.jsx)(n.a,{href:"api-reference/api-reference/cli-options#--accountidaccount",children:(0,a.jsx)(n.code,{children:"--accountId"})})," is present in your credentials."]})}),"\n",(0,a.jsx)(n.h2,{id:"running-from-command-line",children:"Running from command line"}),"\n",(0,a.jsx)(n.p,{children:"Once you have installed the airdrop tool globally, you can run it from the command line using:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-shell",children:'airdrop-tool \\\n  --accountId="jumpfinance.near" \\\n  --accounts="./accounts.json" \\\n  --amount=100 \\\n  --token="jumptoken.jumpfinance.near"\n'})}),"\n",(0,a.jsx)(n.admonition,{type:"note",children:(0,a.jsxs)(n.p,{children:["The above example demonstrates the required options. However, see ",(0,a.jsx)(n.a,{href:"../api-reference/cli-options",children:"additional options"})," for more information."]})})]})}function T(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(_,{...e})}):_(e)}},4252:(e,n,t)=>{t.d(n,{A:()=>l});t(6540);var a=t(5195);const r={tableOfContentsInline:"tableOfContentsInline_prmo"};var i=t(4848);function l(e){var n=e.toc,t=e.minHeadingLevel,l=e.maxHeadingLevel;return(0,i.jsx)("div",{className:r.tableOfContentsInline,children:(0,i.jsx)(a.A,{toc:n,minHeadingLevel:t,maxHeadingLevel:l,className:"table-of-contents",linkClassName:null})})}},5195:(e,n,t)=>{t.d(n,{A:()=>b});var a=t(8587),r=t(6540),i=t(6342),l=["parentIndex"];function o(e){var n=e.map((function(e){return Object.assign({},e,{parentIndex:-1,children:[]})})),t=Array(7).fill(-1);n.forEach((function(e,n){var a=t.slice(2,e.level);e.parentIndex=Math.max.apply(Math,a),t[e.level]=n}));var r=[];return n.forEach((function(e){var t=e.parentIndex,i=(0,a.A)(e,l);t>=0?n[t].children.push(i):r.push(i)})),r}function u(e){var n=e.toc,t=e.minHeadingLevel,a=e.maxHeadingLevel;return n.flatMap((function(e){var n=u({toc:e.children,minHeadingLevel:t,maxHeadingLevel:a});return function(e){return e.level>=t&&e.level<=a}(e)?[Object.assign({},e,{children:n})]:n}))}function s(e){var n=e.getBoundingClientRect();return n.top===n.bottom?s(e.parentNode):n}function c(e,n){var t,a,r=n.anchorTopOffset,i=e.find((function(e){return s(e).top>=r}));return i?function(e){return e.top>0&&e.bottom<window.innerHeight/2}(s(i))?i:null!=(a=e[e.indexOf(i)-1])?a:null:null!=(t=e[e.length-1])?t:null}function d(){var e=(0,r.useRef)(0),n=(0,i.p)().navbar.hideOnScroll;return(0,r.useEffect)((function(){e.current=n?0:document.querySelector(".navbar").clientHeight}),[n]),e}function m(e){var n=(0,r.useRef)(void 0),t=d();(0,r.useEffect)((function(){if(!e)return function(){};var a=e.linkClassName,r=e.linkActiveClassName,i=e.minHeadingLevel,l=e.maxHeadingLevel;function o(){var e=function(e){return Array.from(document.getElementsByClassName(e))}(a),o=function(e){for(var n=e.minHeadingLevel,t=e.maxHeadingLevel,a=[],r=n;r<=t;r+=1)a.push("h"+r+".anchor");return Array.from(document.querySelectorAll(a.join()))}({minHeadingLevel:i,maxHeadingLevel:l}),u=c(o,{anchorTopOffset:t.current}),s=e.find((function(e){return u&&u.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)}));e.forEach((function(e){!function(e,t){t?(n.current&&n.current!==e&&n.current.classList.remove(r),e.classList.add(r),n.current=e):e.classList.remove(r)}(e,e===s)}))}return document.addEventListener("scroll",o),document.addEventListener("resize",o),o(),function(){document.removeEventListener("scroll",o),document.removeEventListener("resize",o)}}),[e,t])}var f=t(8774),v=t(4848);function p(e){var n=e.toc,t=e.className,a=e.linkClassName,r=e.isChild;return n.length?(0,v.jsx)("ul",{className:r?void 0:t,children:n.map((function(e){return(0,v.jsxs)("li",{children:[(0,v.jsx)(f.A,{to:"#"+e.id,className:null!=a?a:void 0,dangerouslySetInnerHTML:{__html:e.value}}),(0,v.jsx)(p,{isChild:!0,toc:e.children,className:t,linkClassName:a})]},e.id)}))}):null}const h=r.memo(p);var g=["toc","className","linkClassName","linkActiveClassName","minHeadingLevel","maxHeadingLevel"];function b(e){var n=e.toc,t=e.className,l=void 0===t?"table-of-contents table-of-contents__left-border":t,s=e.linkClassName,c=void 0===s?"table-of-contents__link":s,d=e.linkActiveClassName,f=void 0===d?void 0:d,p=e.minHeadingLevel,b=e.maxHeadingLevel,x=(0,a.A)(e,g),j=(0,i.p)(),y=null!=p?p:j.tableOfContents.minHeadingLevel,L=null!=b?b:j.tableOfContents.maxHeadingLevel,N=function(e){var n=e.toc,t=e.minHeadingLevel,a=e.maxHeadingLevel;return(0,r.useMemo)((function(){return u({toc:o(n),minHeadingLevel:t,maxHeadingLevel:a})}),[n,t,a])}({toc:n,minHeadingLevel:y,maxHeadingLevel:L});return m((0,r.useMemo)((function(){if(c&&f)return{linkClassName:c,linkActiveClassName:f,minHeadingLevel:y,maxHeadingLevel:L}}),[c,f,y,L])),(0,v.jsx)(h,Object.assign({toc:N,className:l,linkClassName:c},x))}},8453:(e,n,t)=>{t.d(n,{R:()=>l,x:()=>o});var a=t(6540);const r={},i=a.createContext(r);function l(e){const n=a.useContext(i);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),a.createElement(i.Provider,{value:n},e.children)}}}]);